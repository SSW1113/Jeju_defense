import { redis } from '../utils/redis/index.js';

export const initTower = (uuid, payload) => {
  const { x, y } = payload;
  redis.set(`user:${uuid}:tower:${x},${y}`, JSON.stringify({ x, y }));
  console.log(`Redis: 유저 ${uuid}의 타워 생성`);

  return { status: 'success' };
};
