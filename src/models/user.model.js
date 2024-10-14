import { redis } from '../utils/redis/index.js';

class UserManager {
  constructor() {
    this.users = [];
  }

  async addUser(uuid) {
    try {
      const serverTime = Date.now();
      const initialData = {
        currentScore: 0, // 초기 점수
        currentGold: 0, // 초기 골드
        stages: [],
        towers: [],
      };

      initialData.stages.push({ id: 1, score: 0, timestamp: serverTime });
      // initialData.towers.push({
      //   towerId: 'fc1ab506-9398-4d9f-8b10-499bcaa8c7a4',
      //   x: 1182.2641812587503,
      //   y: 341.1542535393114,
      //   towerNumber: 0,
      //   upgrade: 0,
      // });

      await redis.set(`user:${uuid}:data`, JSON.stringify(initialData));
      console.log(`Redis: 유저 ${uuid}에 대한 초기 데이터 생성`);

      return true;
    } catch (error) {
      console.log('Redis: 처리 오류:', error);

      return false;
    }
  }

  // getUser(){
  //     return this.users;
  // }

  async removeUser(uuid) {
    try {
      await redis.del(`user:${uuid}:data`);
      console.log(`Redis: ${uuid}의 데이터 삭제`);

      return true;
    } catch (error) {
      console.log('Redis: 데이터 삭제 오류:', error);

      return false;
    }
  }
}

export const userManager = new UserManager();
