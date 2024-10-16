import { scoreAndGoldManager } from "../src/ScoreAndGoldManager.js";
import { towerManager } from "../src/towerManager.js";

  /*---------------------------------------------
    [스테이지 클리어 이벤트]
---------------------------------------------*/
export const S2CStageMove = (uuid, payload)=>{
    console.log("S2CStageMove", payload);

    scoreAndGoldManager.gold = payload.gold;
    scoreAndGoldManager.monsterLevel = payload.currentStage;
    scoreAndGoldManager.remainMonsters = payload.remainMonsters;

    return {status: 'success'};
}