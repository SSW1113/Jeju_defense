import { S2CBuyTower } from "./S2CBuyTower.handler.js";
import { S2CInitTower } from "./S2CInitTower.handler.js";
import { S2CMonsterKill } from "./S2CMonsterKill.handler.js";
import { S2CStageMove } from "./S2CStageMove.handler.js";
import { S2CStartGame } from "./S2CStartGame.handler.js";
import { genMonster } from "./genMonster.handler.js";
  /*---------------------------------------------
    [사용자 정의 이벤트 콜백 함수]
    3. genMonster: 서버로부터 받은 monsterID를 통해 몬스터 생성
---------------------------------------------*/
const handlerMappings = {
  3 : genMonster,
  40: S2CMonsterKill,
  41: S2CBuyTower,
  44: S2CStartGame,
  45: S2CInitTower,
  46: S2CStageMove
};

export default handlerMappings