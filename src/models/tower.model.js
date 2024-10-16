import { redis } from '../utils/redis/index.js';

class TowerManager {
  constructor() {
    
  }

  async addTower(uuid, towerData) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);

      // 타워 추가
      userData.towers.push(towerData);

      // 데이터 저장
      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

      return true;
    } catch (err) {
      console.log('Redis: 처리 오류:', err);

      return false;
    }
  }

  async getTower(uuid, towerUuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);

      const towerIndex = userData.towers.findIndex((e) => e.towerUuid === towerUuid);

      console.log("------------------------------------------")
      console.log(userData)
      console.log(towerUuid)
      console.log("------------------------------------------")
      return userData.towers[towerIndex];
    } catch (error) {
      console.log(`Redis: 데이터 가져오기 오류: `, error);
      return null;
    }
  }

  async updateTower(uuid, towerId, updatedTowerData) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);
      const towerIndex = userData.towers.findIndex((e) => e.towerId === towerId);
      userData.towers[towerIndex] = updatedTowerData;

      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
      console.log(`Redis: 타워 ${uuid}의 데이터 업데이트 완료`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 업데이트 오류: `, error);

      return false;
    }
  }

  async upgradeTower(uuid, towerUuid){
    try {
        const userDataJSON = await redis.get(`user:${uuid}:data`);
        const userData = JSON.parse(userDataJSON);
        const towerIndex = userData.towers.findIndex((e) => e.towerUuid === towerUuid);

        userData.towers[towerIndex].upgrade += 1;
  
        await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
        console.log(`Redis: 타워 ${towerUuid}의 데이터 업그레이드 완료`);
  
        return true;
      } catch (error) {
        console.log(`Redis: 타워 업그레이드 오류: `, error);
  
        return false;
      }
  }

  async removeTower(uuid, towerUuid) {
    try {
      const userDataJSON = await redis.get(`user:${uuid}:data`);
      const userData = JSON.parse(userDataJSON);
      const towerIndex = userData.towers.findIndex((e) => e.uuid === towerUuid);

      userData.towers.splice(towerIndex, 1);

      await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
      console.log(`${towerUuid}타워 데이터 삭제`);

      return true;
    } catch (error) {
      console.log(`Redis: 데이터 삭제 오류: `, error);

      return false;
    }
  }
}

export const serverTowerManager = new TowerManager();