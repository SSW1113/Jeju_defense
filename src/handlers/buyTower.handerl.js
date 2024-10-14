import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const buyTower = async (uuid, payload) => {
  const { towerId, position } = payload;

  //유저의 골드 가져오기
  const existingGold = await redis.get(`user:${uuid}:gold`);
  if(!existingGold){
    return { status: 'fail', message: '유저의 골드 정보를 가져오는 데 실패했습니다..' };
  }
  
  //타워의 비용 가져오기
  const towerCost = serverAssetManager.getTowerCost(towerId);
  if(!towerCost){
    return { status: 'fail', message: '유효하지 않은 towerId입니다.' };
  }
  
  const userGold = parseInt(existingGold, 10);
  //유저의 골드로 살 수 있는지 검증
  if (userGold < towerCost) {
    return { status: 'fail', message: '골드가 부족합니다.' };
  }

  // 유저의 기존 타워 배열을 가져오기
  let towers = [];
  const existingTowers  = await redis.get(`user:${uuid}:towers`);
  if (existingTowers ) {
    towers = JSON.parse(existingTowers); 
  }
  else{
    console.log(`Redis: 유저의 타워 정보가 없어 새로 생성`);
  }
  
  // 새 타워 추가
  towers.push(position);

  console.log(towers);
  // 업데이트된 배열을 Redis에 저장
  await redis.set(`user:${uuid}:towers`, JSON.stringify(towers));

  //골드 차감
  const updatedGold = userGold-towerCost;
  await redis.set(`user:${uuid}:gold`, updatedGold.toString());

  console.log(`Redis: 유저 ${uuid}의 타워 추가됨`);
  return { status: 'success', packetId: ePacketId.S2CBuyTower, payload: {towerId, position} };
};
