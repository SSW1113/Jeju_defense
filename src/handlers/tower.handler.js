import { towerManager } from '../models/tower.model.js';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../utils/redis/index.js';

// 타워 구매 핸들러
export const buyTowerHandler = async (uuid, payload) => {
  const { towerNumber, x, y } = payload;
  const towerId = uuidv4();

  const userGold = await redis.get(`user:${uuid}:gold`);
  if (!userGold) {
    return { status: 'fail', message: '유저 골드 정보 조회 실패.' };
  }

  let towerCost;
  switch (towerCost) {
    case 0:
      towerCost = 1000;
      break;
    case 1:
      towerCost = 1500;
      break;
    case 2:
      towerCost = 2000;
      break;
    case 3:
      towerCost = 2500;
      break;
  }

  if (userGold < towerCost) {
    return { status: 'fail', message: '골드가 부족합니다.' };
  }

  const success = await towerManager.addTower(uuid, { towerId, x, y, towerNumber });
  if (!success) {
    return { status: 'fail', message: '타워 추가 실패' };
  }

  return { status: 'success', message: '타워 추가 성공' };
};

// 타워 업그레이드 핸들러
export const upgradeTowerHandler = async (uuid, payload) => {
  const { towerId, currentUpgrade } = payload;

  const tower = await towerManager.getTower(towerId);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  const userGold = await redis.get(`user:${uuid}:gold`);
  if (!userGold) {
    return { status: 'fail', message: '유저 골드 정보 조회 실패.' };
  }

  let upgradeCost;
  const towerNumber = tower.towerNumber;
  switch (towerNumber) {
    case 0:
      upgradeCost = 500;
      break;
    case 1:
      upgradeCost = 750;
      break;
    case 2:
      upgradeCost = 1000;
      break;
    case 3:
      upgradeCost = 1250;
      break;
  }

  if (userGold < upgradeCost) {
    return { status: 'fail', message: '골드가 부족합니다.' };
  }

  const success = await towerManager.updateTower(towerId, { upgrade: currentUpgrade + 1 });
  if (!success) {
    return { status: 'fail', message: '타워 정보 업데이트 실패' };
  }

  return { status: 'success', message: '타워 정보 업데이트 성공' };
};

// 타워 판매 핸들러
export const sellTowerHandler = async (uuid, payload) => {
  const { towerId, sellPrice } = payload;

  const tower = await towerManager.getTower(towerId);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  const success = await towerManager.removeTower(towerId);

  if (!success) {
    return { status: 'fail', message: '타워 판매 실패' };
  }

  return { status: 'success', message: '타워 판매 성공' };
};
