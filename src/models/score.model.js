import { redis } from '../utils/redis/index.js';

class ScoreManager {
  /**
   * 스테이지 할당
   * @param uuid
   * @param stageId
   * @param score
   * @param timestamp
   */
  async addScore(uuid, score) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData =JSON.parse(userDataJSON);

      // 점수 증가
      userData.score += score;

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
  async getScore(uuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

      if (userData) {
        // currentScore 반환
        return userData.score;
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

export const scoreManager = new ScoreManager();
