import { redis } from '../utils/redis/index.js';

class GoldManager {
  /**
   * 스테이지 할당
   * @param uuid
   * @param gold
   * @param timestamp
   */
  async earnGold(uuid, gold) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON) 

      // 골드 증가
      userData.gold += gold;

      // 데이터 저장
      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
    }
  }

  /**
   * 스테이지 불러오기
   * @param uuid
   */
  async getGold(uuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

      if (userData) {
        // gold 반환
        return userData.gold;
      } else {
        console.log(`사용자 ${uuid}의 데이터가 없습니다.`);
        return 0;
      }
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
      return 0;
    }
  }
}

export const goldManager = new GoldManager();
