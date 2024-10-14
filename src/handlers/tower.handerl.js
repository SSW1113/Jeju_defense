import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const buyTower = async (uuid, payload) => {
  const { towerId, position } = payload;

  // 유저의 전체 데이터를 가져오기 (골드, 타워 정보 등)
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  if(!userDataJSON){
    return;
  }
  const userData = JSON.parse(userDataJSON);
  console.log("userData", userData);

    
    // 타워의 비용 가져오기
    const towerCost = serverAssetManager.getTowerCost(towerId);
    if (!towerCost) {
      return { status: 'fail', message: '유효하지 않은 towerId입니다.' };
    }
    
    const userGold = userData.currentGold;
    console.log("towerCost: ", towerCost);
    console.log("userGold: ", userGold);
    // 유저의 골드로 살 수 있는지 검증
    if (userGold < towerCost) {
      return { status: 'fail', message: '골드가 부족합니다.' };
    }
    
    
  // 새 타워 추가
  userData.towers.push(position);

  // 골드 차감
  userData.currentGold = userGold - towerCost;

  // 업데이트된 전체 유저 데이터를 Redis에 저장
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

  console.log(`Redis: 유저 ${uuid}의 타워 추가됨, 골드 차감됨`);
  return { status: 'success', packetId: ePacketId.S2CBuyTower, payload: { towerId, position, currentGold: userData.currentGold } };
};
