import { redis } from '../utils/redis/index.js';

class TowerManager {
  constructor() {
    this.towers = [];
  }

  async addTower(uuid, towerData) {
    try {
      await redis.set(`tower:${uuid}:data`, JSON.stringify(towerData));
      console.log(`Redis: 타워${uuid}에 대한 데이터 저장`);

      return true;
    } catch (error) {
      console.log(`Redis: 처리 오류: `, error);

      return false;
    }
  }

  async getTower(uuid) {
    try {
      const data = await redis.get(`tower:${uuid}:data`);

      return JSON.parse(data);
    } catch (error) {
      console.log(`Redis: 데이터 가져오기 오류: `, error);
      return null;
    }
  }

  async updateTower(uuid, updatedTowerData) {
    try {
      await redis.set(`tower:${uuid}:data`, JSON.stringify(updatedTowerData));
      console.log(`Redis: 타워 ${uuid}의 데이터 업데이트 완료`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 업데이트 오류: `, error);

      return false;
    }
  }

  async removeTower(uuid) {
    try {
      await redis.del(`tower:${uuid}:data`);
      console.log(`Redis: ${uuid}의 데이터 삭제`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 삭제 오류: `, error);

      return false;
    }
  }
}

export const towerManager = new TowerManager();
