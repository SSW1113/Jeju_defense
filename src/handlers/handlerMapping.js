import { initTower } from './initTower.handler.js';
import { startGame } from './startGame.handler.js';

const handlerMappings = {
  4: startGame,
  5: initTower,
};

export default handlerMappings;
