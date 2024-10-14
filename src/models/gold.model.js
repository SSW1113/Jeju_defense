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
      const userData = userDataJSON ? JSON.parse(userDataJSON) : { currentScore: 0, currentGold: 0, stages: [] };

      // 골드 증가
      userData.currentGold += gold;

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
        // currentGold 반환
        return userData.currentGold;
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
