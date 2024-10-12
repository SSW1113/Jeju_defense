import { monsterManager } from "../src/monsterManager.js";

export const genMonster = (uuid, payload)=>{
    //3. itemManager에 로그 기록
    console.log("payload: ", payload.speed);
    monsterManager.spawnMonster(payload.monsterId, payload.level, payload.maxHp, payload.hp, payload.attackPower, payload.speed, payload.goldDrop)
    return {status: 'success'};
}