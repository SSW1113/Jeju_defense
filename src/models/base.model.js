import { redis } from '../utils/redis/index.js';

class BaseManager {
  async getBaseHp(uuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);

      return userData.baseHp;
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
    }
  }

  async updateBaseHp(uuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);

      userData.baseHp--;

      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
    }
  }
}

export const baseManager = new BaseManager();
