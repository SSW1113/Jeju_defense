import { redis } from '../utils/redis/index.js';

class TowerManager {
  constructor() {
    this.towers = [];
  }

  async addTower(uuid, towerData) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON;

      console.log('userData:', userData);
      console.log('userData.towers: ', userData.towers);

      // 타워 추가
      userData.towers.push(towerData);

      // 데이터 저장
      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
    } catch (err) {
      console.log('Redis: 처리 오류:', err);

      return false;
    }
  }

  async getTower(uuid, towerId) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON;

      const towerIndex = userData.towers.findIndex((e) => e.id === towerId);

      return userData.towers[towerIndex];
    } catch (error) {
      console.log(`Redis: 데이터 가져오기 오류: `, error);
      return null;
    }
  }

  async updateTower(uuid, towerId, updatedTowerData) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON;
      const towerIndex = userData.towers.findIndex((e) => e.id === towerId);

      userData.towers[towerIndex] = updatedTowerData;

      await redis.set(`user:${uuid}:data`, JSON.stringify(updatedTowerData));
      console.log(`Redis: 타워 ${uuid}의 데이터 업데이트 완료`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 업데이트 오류: `, error);

      return false;
    }
  }

  async removeTower(uuid, towerId) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = userDataJSON;
      const towerIndex = userData.towers.findIndex((e) => e.id === towerId);

      userData.towers.splice(towerIndex, 1);

      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
      console.log(`${towerId}타워 데이터 삭제`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 삭제 오류: `, error);

      return false;
    }
  }
}

export const towerManager = new TowerManager();
