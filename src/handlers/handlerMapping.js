import { ePacketId } from '../../public/Packet.js';
import { buyTowerHandler, sellTowerHandler, upgradeTowerHandler } from './tower.handler.js';

const handlerMappings = {
  [ePacketId.BuyTower]: buyTowerHandler,
  [ePacketId.UpgradeTower]: upgradeTowerHandler,
  [ePacketId.SellTower]: sellTowerHandler,
};

export default handlerMappings;
