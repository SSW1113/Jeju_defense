import { monsterManager } from "../src/monsterManager.js";

  /*---------------------------------------------
    [몬스터 생성 이벤트]
    1. 서버로부터 monsterID, level수신 
    2. AssetManager에게 monsterId를 전달하여 능력치 가져오기
    3. 가져온 능력치와 monsterID에 mapping된 이미지를 사용해 몬스터 생성

    [TODO]  
    - monsterID가 유효한 값인지 검증하기
---------------------------------------------*/
export const genMonster = (uuid, payload)=>{
    monsterManager.spawnMonster(payload.monsterId, payload.level);
    
    return {status: 'success'};
}