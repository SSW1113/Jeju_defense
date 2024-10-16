import { towerManager } from "../src/towerManager.js";

  /*---------------------------------------------
    [초기 타워 설치 이벤트]
---------------------------------------------*/
export const S2CInitTower = (uuid, payload)=>{
    console.log("S2CInitTower")
    towerManager.spawnTower(payload.towerId, payload.position);
    
    return {status: 'success'};
}