import { Server } from "socket.io";
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
                currentGold: 0,   // 초기 골드
                stages: []
            };

            initialData.stages.push({ id: 1, score: 0, timestamp: serverTime });

            await redis.set(`user:${uuid}:data`, JSON.stringify(initialData));
            console.log(`Redis: 유저 ${uuid}에 대한 초기 데이터 생성`);

            return true;
        } catch (error) {
            console.log("Redis: 처리 오류:", error);

            return false;
        }
    };
    
    // getUser(){
    //     return this.users;
    // }
    
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