import { buyTower } from './buyTower.handerl.js';
import { initTower } from './initTower.handler.js';
import { startGame } from './startGame.handler.js';
import { moveStageHandler } from "./stage.handler.js";
import { killMonsterHandler } from "./monster.handler.js";

const handlerMappings = {
  4: startGame,
  5: initTower,
  11: moveStageHandler,
  21: killMonsterHandler,
  31: buyTower,
};

export default handlerMappings;
