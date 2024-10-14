import { scoreAndGoldManager } from "../src/ScoreAndGoldManager.js";
import { towerManager } from "../src/towerManager.js";

  /*---------------------------------------------
    [몬스터 처치 이벤트]
---------------------------------------------*/
export const S2CMonsterKill = (uuid, payload)=>{
  
    console.log("S2CMonsterKill", payload)
  
    scoreAndGoldManager.gold = payload.gold;
    scoreAndGoldManager.score = payload.score;
    scoreAndGoldManager.remainMonsters -=1;
    
    return {status: 'success'};
}