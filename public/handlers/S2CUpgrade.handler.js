import { scoreAndGoldManager } from "../src/ScoreAndGoldManager.js";
import { towerManager } from "../src/towerManager.js";


  /*---------------------------------------------
    [타워 업그레이드 이벤트]

    타워id랑
    tower.upgrade()
---------------------------------------------*/
export const S2CUpgradeTower = (uuid, payload)=>{
    console.log("S2CUpgradeTower", payload);

    //towerManager에 타워가 존재하는지 
    const tower = towerManager.getTower(payload.towerUuid);
    tower.upgradeTower();
    console.log("결과는", tower)    //
    console.log("페이로드는", payload)    //
    return {status: 'success'};
}