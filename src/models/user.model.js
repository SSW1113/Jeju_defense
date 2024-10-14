import { redis } from "../utils/redis/index.js";


class UserManager{
    constructor(){
        this.users = [];
    }

    async addUser(uuid){
        try {
            const serverTime = Date.now();
            const initialData = {
                currentScore: 0,  // 초기 점수
                highScore: 0,
                currentGold: 0,   // 초기 골드
                stages: []
            };

            initialData.stages.push(`{ id: 1, score: 0, timestamp: serverTime }`);

            await redis.set(`user:${uuid}:data`, JSON.stringify(initialData));
            console.log(`Redis: 유저 ${uuid}에 대한 초기 데이터 생성`);

            return true;
        } catch (error) {
            console.log("Redis: 처리 오류:", error);

            return false;
        }
    };
    
    async getUser(uuid){
        try{
            const data = await redis.get(`user:${uuid}:data`)

            return JSON.parse(data);
        } catch (error) {
            console.log("Redis: 처리 오류:", error);
        }
     }

//score model로 이동
     async newHighScore(uuid, score) {
        try {
          const userDataJSON = await redis.get(`user:${uuid}:data`);
          const userData = userDataJSON ? JSON.parse(userDataJSON) : { currentScore: 0, highScore:0, currentGold: 0, stages: [] };
    
          // 점수 증가
          userData.highScore = score;
    
          // 데이터 저장
          await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
        } catch (err) {
          console.log('Redis: 처리 오류:', err);
        }
      }
    
    async removeUser(uuid){
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