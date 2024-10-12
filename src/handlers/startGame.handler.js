// 1. 클라: 서버에게 gameStart패킷 전송
// 2. 클라: 서버에게 기본 타워 건설(무료, 랜덤 위치) 패킷 전송
// 3. 서버:  gameStart패킷 수신
// 4. 서버: 클라에게 시작 골드(2000G)  전송 및 redis에 골드 데이터 추가
// 5. 서버: 기본 타워 건설 패킷 수신
// 6. 서버:
//     1. 무작위 위치 정하기
//     2. redis에 타워 위치 저장
//     3. 클라에게 타워 위치 전송

import { redis } from '../utils/redis/index.js';

export const startGame = (uuid, payload) => {
  redis.set(`user:${uuid}:gold`, 2000);
  console.log(`Redis: 유저 ${uuid}의 골드 2000G로 초기화`);

  return { status: 'success' };
};
