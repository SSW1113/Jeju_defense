import { scoreAndGoldManager } from "../src/ScoreAndGoldManager.js";
import { towerManager } from "../src/towerManager.js";

  /*---------------------------------------------
    [몬스터 처치 이벤트]
---------------------------------------------*/
export const S2CMonsterKill = (uuid, payload)=>{
    console.log("S2CMonsterKill", payload)
  
    scoreAndGoldManager.gold = payload.currentGold;
    scoreAndGoldManager.score = payload.currentScore;
    scoreAndGoldManager.remainMonsters = remainMonsters;
    
    return {status: 'success'};
}