import { Server } from "socket.io";
import { redis } from "../utils/redis/index.js";
import { monsterManager } from "./monsterSpawner.model.js";
import { Utils } from "../utils/Utils.js";

class UserManager{
    constructor(){
        this.users = [];
    }

    async addUser(uuid){
        try {
            const serverTime = Date.now();
            const initialData = {
                score: 0,  // 초기 점수
                gold: 0,   // 초기 골드
                baseHp: 20,
                stages: [],
                towers: []
            };

            initialData.stages.push({ id: 0, score: 0, timestamp: serverTime });

            await redis.set(`user:${uuid}:data`, JSON.stringify(initialData));
            console.log(`Redis: 유저 ${uuid}에 대한 초기 데이터 생성`);

            return true;
        } catch (error) {
            console.log("Redis: 처리 오류:", error);

            return false;
        }
    };
    
    async removeUser(uuid){
        try {
            await redis.del(`user:${uuid}:data`);
            console.log(`Redis: ${uuid}의 데이터 삭제`);

            if(monsterManager.removeSpawner(uuid)){
                console.log(`Monster Spawner: ${uuid}의 데이터 삭제`);
            }
            else{
                console.log('Monster Spawner: 데이터 삭제 오류:');
            }

            return true;
        } catch (error) {
            console.log('Redis: 데이터 삭제 오류:', error);

            return false;
        }
    }

    async attackedBase(uuid, damage) {
        try {
          const userDataJSON = await redis.get(`user:${uuid}:data`);
          const userData = JSON.parse(userDataJSON);
      
          //기지 체력 감소
          userData.baseHp = Utils.clamp(userData.baseHp-damage, 0, userData.baseHp);
      
          
          await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
      
          console.log('Redis: 기지 체력 갱신 완료:', userData.baseHp);
          return userData.baseHp; // 갱신된 기지 체력 반환
        } catch (error) {
          console.log(`Redis: 데이터 가져오기 오류:`, error);
          return null;
        }
      }
      
}

export const userManager = new UserManager();