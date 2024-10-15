import { ePacketId } from '../../public/Packet.js';
import { buyTowerHandler, sellTowerHandler, upgradeTowerHandler } from './tower.handler.js';
import { initTower } from './initTower.handler.js';
import { startGame } from './startGame.handler.js';
import { moveStageHandler } from "./stage.handler.js";
import { killMonsterHandler } from "./monster.handler.js";
import { buyTowerHandler } from './tower.handerl.js';

const handlerMappings = {
  [ePacketId.StartGame]: startGame,
  [ePacketId.InitTower]: initTower,
  [ePacketId.NextStage]: moveStageHandler,
  [ePacketId.MonsterKill]: killMonsterHandler,
  [ePacketId.BuyTower]: buyTowerHandler,
  [ePacketId.UpgradeTower]: upgradeTowerHandler,
  [ePacketId.SellTower]: sellTowerHandler,
};

export default handlerMappings;
