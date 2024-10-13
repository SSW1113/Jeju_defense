import { buyTower } from './buyTower.handerl.js';
import { initTower } from './initTower.handler.js';
import { startGame } from './startGame.handler.js';

const handlerMappings = {
  4: startGame,
  5: initTower,
  31: buyTower
};

export default handlerMappings;
