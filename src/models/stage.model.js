import { redis } from '../utils/redis/index.js';

class StageManager {
  /**
   * 스테이지 할당
   * @param uuid
   * @param stageId
   * @param score
   * @param timestamp
   */
  async setStage(uuid, stageId, score, timestamp) {
    try {
      const stagesJSON = await redis.get(`user:${uuid}:data`);
      const stages = stagesJSON ? JSON.parse(stagesJSON) : [];

      stages.push({ stageId, score, timestamp });
      console.log(`${uuid}는 다음 스테이지로 이동합니다!`);

      await redis.set(`user:${uuid}:data`, JSON.stringify(stages));
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
      const stagesJSON = await redis.get(`user:${uuid}:data`);
      const stages = stagesJSON ? JSON.parse(stagesJSON) : [];

      return stages;
    } catch (err) {
      console.log('Redis: 처리 오류:', err);
    }
  }
}

export const stageManager = new StageManager();
