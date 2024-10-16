import { scoreAndGoldManager } from "../src/ScoreAndGoldManager.js";
import { towerManager } from "../src/towerManager.js";

/*---------------------------------------------
    [몬스터 처치 이벤트]
    payload: {gold: currentGold, score: currentScore, remainMonsters }};
---------------------------------------------*/
export const S2CMonsterKill = (uuid, payload)=>{
  
    console.log("S2CMonsterKill", payload)
  
    scoreAndGoldManager.gold = payload.gold;
    scoreAndGoldManager.score = payload.score;
    scoreAndGoldManager.remainMonsters -=1;
    
    return {status: 'success'};
}

/*---------------------------------------------
    [히든 몬스터 처치 이벤트]
    - payload: {gold: currentGold, score: currentScore, remainHiddenMonsters }}
---------------------------------------------*/
export const S2CHiddenMonsterKill = (uuid, payload)=>{
  
  console.log("S2CMonsterKill", payload)

  scoreAndGoldManager.gold = payload.gold;
  scoreAndGoldManager.score = payload.score;
  scoreAndGoldManager.remainHiddenMonsters -=1;
  
  return {status: 'success'};
}

/*---------------------------------------------
    [보스 몬스터 처치 이벤트]

    -payload: {gold: currentGold, score: currentScore }
---------------------------------------------*/
export const S2CBossMonsterKill = (uuid, payload)=>{
  
  console.log("S2CMonsterKill", payload)

  scoreAndGoldManager.gold = payload.gold;
  scoreAndGoldManager.score = payload.score;
  scoreAndGoldManager.isBossKilled = true;
  
  return {status: 'success'};
}