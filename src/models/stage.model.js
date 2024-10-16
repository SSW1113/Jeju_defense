import { redis } from '../utils/redis/index.js';

class StageManager {
  /**
   * 스테이지 할당
   * @param uuid
   * @param stageId
   * @param score
   * @param monster
   * @param timestamp
   */
  async setStage(uuid, id, monster, gold, score, timestamp) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON)

      // 스테이지 추가
      userData.stages.push({ id, monster, gold, score, timestamp });
      console.log(`${uuid}는 다음 스테이지로 이동합니다!`);

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
  async getStage(uuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON
        ? JSON.parse(userDataJSON)
        : { score: 0, gold: 0, stages: [] };

      return userData.stages;
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
    }
  }
}

export const stageManager = new StageManager();
