import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

/*---------------------------------------------
    [초기 타워 생성]

    1. 클라가 보낸 좌표 값, 타워ID redis에 저장
    2. 클라에게 좌표 값, 타워 ID 전송(상태 동기화)
---------------------------------------------*/
export const initTower = async (uuid, payload) => {
  const { towerId, position } = payload;

  // 유저의 기존 타워 배열을 가져오기
  let towers = [];
  const existingTowers = await redis.get(`user:${uuid}:towers`); 
  if (existingTowers) {
    towers = JSON.parse(existingTowers); 
  } else {
    console.log(`Redis: 유저의 타워 정보가 없어 새로 생성`);
  }

  // 새 타워 추가
  towers.push(position);

  console.log(position); 

  // 업데이트된 배열을 Redis에 저장
  await redis.set(`user:${uuid}:towers`, JSON.stringify(towers));

  console.log(`Redis: 유저 ${uuid}의 타워 추가됨`);
  return { status: 'success', packetId: ePacketId.S2CInitTower, payload: { towerId, position } };
};
