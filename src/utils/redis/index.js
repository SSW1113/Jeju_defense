// redis.js

import { createClient } from 'redis';

export const redis = createClient();

redis.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log('Redis: 연결');
  } catch (err) {
    console.error('Redis: 연결 오류:', err);
  }
};

connectRedis();
