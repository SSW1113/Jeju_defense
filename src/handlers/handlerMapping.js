import { moveStageHandler } from './stage.handler.js';
import { killMonsterHandler } from './monster.handler.js';

const handlerMappings = {
  11: moveStageHandler,
  21: killMonsterHandler
};

export default handlerMappings;
