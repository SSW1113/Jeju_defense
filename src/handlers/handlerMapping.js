import { moveStageHandler } from './stage.handler.js';
import { killMonsterHandler, killHiddenMonsterHandler } from './monster.handler.js';

const handlerMappings = {
  11: moveStageHandler,
  21: killMonsterHandler,
  22: killHiddenMonsterHandler,
};

export default handlerMappings;
