import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const buyTower = (uuid, payload) => {
  const { towerId, position } = payload;

    //redis에 타워 정보 추가(uuid를 키값)
    console.log("Buy Tower", payload)
  
  console.log(`Redis: 유저 ${uuid}의 타워 생성`);
  
  //유저에게 towerId, 좌표 보내기
  return { packetId: ePacketId.S2CBuyTower, data: {towerId, position} };
};
