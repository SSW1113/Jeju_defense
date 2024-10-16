import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';
import { v4 as uuidv4 } from 'uuid';
/*---------------------------------------------
    [초기 타워 생성]

    1. 클라가 보낸 좌표 값, 타워ID를 Redis에 저장
    2. 클라에게 좌표 값, 타워 ID 전송(상태 동기화)
---------------------------------------------*/
export const initTower = async (uuid, payload) => {
  const { towerId, position } = payload;

  // 유저의 전체 데이터를 가져오기 (골드, 타워 정보 등)
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  const userData = JSON.parse(userDataJSON)

  console.log("userData", userData);
  
  // 새 타워 추가
  const towerUuid = uuidv4();
  userData.towers.push({position, towerId, towerUuid, upgrade: 0});

  // 업데이트된 유저 데이터를 Redis에 저장
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

  console.log(`Redis: 유저 ${uuid}의 타워 추가됨, 위치:`, position);

  // 클라이언트에 타워 정보를 동기화
  return { status: 'success', packetId: ePacketId.S2CInitTower, payload: { towerId, position } };
};
