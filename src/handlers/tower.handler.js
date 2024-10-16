import { REFUND_PERCENT } from '../constants.js';
import { serverAssetManager } from '../init/assets.js';
import { serverTowerManager } from '../models/tower.model.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';
import { v4 as uuidv4 } from 'uuid';

/*---------------------------------------------
    [타워 구입]

    1. redis에서 유저 정보 가져오기
    2. payload로 받은 towerId로 타워 비용 가져오기
    3. 유저의 골드로 살 수 있는지 검증
      3-1. 골드가 부족하면 { status: fail }반환
    4. redis에 변경사항 저장
      4-1. 골드 차감 
      4-2. payload로 받은 좌표
---------------------------------------------*/
export const buyTowerHandler = async (uuid, payload) => {
  const { towerId, position } = payload;

  //1. redis에서 유저 정보 가져오기
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  if (!userDataJSON) {
    return;
  }
  const userData = JSON.parse(userDataJSON);
  console.log('userData', userData);

  //2. payload로 받은 towerId로 타워 비용 가져오기
  const towerCost = serverAssetManager.getTowerCost(towerId);
  if (!towerCost) {
    return { status: 'fail', message: '유효하지 않은 towerId입니다.' };
  }

  const userGold = userData.gold;
  console.log('towerCost: ', towerCost);
  console.log('userGold: ', userGold);

  //3. 유저의 골드로 살 수 있는지 검증
  //3-1. 골드가 부족하면 { status: fail }반환
  if (userGold < towerCost) {
    return { status: 'fail', message: '골드가 부족합니다.' };
  }

  const towerUuid = uuidv4();

  // 4-1. 골드 차감
  userData.gold = userGold - towerCost;
  // 4-2. payload로 받은 좌표
  userData.towers.push({ position, towerId, towerUuid, upgrade: 0 });

  // 4. redis에 변경사항 저장
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

  console.log(`Redis: 유저 ${uuid}의 타워 추가됨, 골드 차감됨`);

  return {
    status: 'success',
    packetId: ePacketId.S2CBuyTower,
    payload: { towerId, towerUuid, position, gold: userData.gold },
  };
};

/*---------------------------------------------
    [타워 업그레이드]
---------------------------------------------*/
export const upgradeTowerHandler = async (uuid, payload) => {
  const tower = await serverTowerManager.getTower(uuid, payload.towerUuid);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  // 돈 확인
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  if (!userDataJSON) {
    return;
  }
  const userData = JSON.parse(userDataJSON);
  const userGold = userData.gold;

  let totalCost = serverAssetManager.getUpgradeTowerUpgradeCost(payload.towerId);
  const upgradeCostInc = serverAssetManager.getUpgradeTowerUpgradeCostInc(payload.towerId);
  for (let i = 0; i < tower.upgrade; i += 1) {
    totalCost += (i * upgradeCostInc);
  }

  if (userGold < totalCost) {
    return { status: 'fail', message: '골드가 부족합니다.' };
  }

  // 돈 차감
  userData.gold -= totalCost;
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

  const success = await serverTowerManager.upgradeTower(uuid, payload.towerUuid);
  if (!success) {
    return { status: 'fail', message: '타워 정보 업데이트 실패' };
  }

  return {
    status: 'success',
    packetId: ePacketId.S2CUpgradeTower,
    payload: { towerUuid: payload.towerUuid, gold: totalCost },
  };
};

/*---------------------------------------------
    [타워 판매]
---------------------------------------------*/
export const sellTowerHandler = async (uuid, payload) => {
  const tower = await serverTowerManager.getTower(uuid, payload.towerUuid);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  const success = await serverTowerManager.removeTower(uuid, payload.towerUuid);

  if (!success) {
    return { status: 'fail', message: '타워 판매 실패' };
  }

  //기본 타워 설치 비용 계산
  let totalCost = serverAssetManager.getTowerCost(payload.towerId);

  //기본 업그레이드 비용 계산
  const upgradeCost = serverAssetManager.getUpgradeTowerUpgradeCost(payload.towerId);

  //업그레이드 추가 비용 계산
  const upgradeCostInc = serverAssetManager.getUpgradeTowerUpgradeCostInc(payload.towerId);
  for (let i = 0; i < tower.upgrade; i += 1) {
    totalCost += upgradeCost + i * upgradeCostInc;
  }

  //지금은 0.6
  const resellGold = totalCost * REFUND_PERCENT;

  return {
    status: 'success',
    packetId: ePacketId.S2CSellTower,
    payload: { towerUuid: payload.towerUuid, gold: resellGold },
  };
};
