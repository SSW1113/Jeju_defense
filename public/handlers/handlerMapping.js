import { ePacketId } from "../Packet.js";
import { S2CInitTower } from "./S2CInitTower.handler.js";
import { S2CBossMonsterKill, S2CHiddenMonsterKill, S2CMonsterKill } from "./S2CMonsterKill.handler.js";
import { S2CStageMove } from "./S2CStageMove.handler.js";
import { S2CStartGame } from "./S2CStartGame.handler.js";
import { S2CBuyTower, S2CSellTower, S2CUpgradeTower } from "./S2CTower.handler.js";

import { genMonster } from "./genMonster.handler.js";
  /*---------------------------------------------
    [사용자 정의 이벤트 콜백 함수]
    3. genMonster: 서버로부터 받은 monsterID를 통해 몬스터 생성
---------------------------------------------*/
const handlerMappings = {
  [ePacketId.S2CGenMonster]: genMonster,
  [ePacketId.S2CMonsterKill]: S2CMonsterKill,
  [ePacketId.S2CBuyTower]: S2CBuyTower,
  [ePacketId.S2CSellTower]: S2CSellTower,
  [ePacketId.S2CUpgradeTower]: S2CUpgradeTower,
  [ePacketId.S2CStartGame]: S2CStartGame,
  [ePacketId.S2CInitTower]: S2CInitTower,
  [ePacketId.S2CStageMove]: S2CStageMove,
  [ePacketId.S2CHiddenMonsterKill]: S2CHiddenMonsterKill,
  [ePacketId.S2CBossMonsterKill]: S2CBossMonsterKill
};

export default handlerMappings