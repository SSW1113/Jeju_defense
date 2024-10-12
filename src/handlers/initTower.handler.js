// 1. 클라: 서버에게 initTower패킷 전송
// 타워 초기 배치 함수를 실행 (처음에 numOfInitialTowers로 2개 설치)
// 패킷에는 위치값이 들어있음
// 2. 서버: initTower패킷 수신
// 서버에서 위치 값 검증 후 레디스 저장

import { redis } from '../utils/redis/index.js';

export const initTower = (uuid, payload) => {
  redis.set(`user:${uuid}:tower`, JSON.stringify({ x: payload.x, y: payload.y }));
  console.log(`Redis: 유저 ${uuid}의 타워 생성`);

  return { status: 'success' };
};
