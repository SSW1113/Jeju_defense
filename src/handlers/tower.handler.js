import { towerManager } from '../models/tower.model.js';
import { v4 as uuidv4 } from 'uuid';

export const buyTowerHandler = async (uuid, payload) => {
  const { x, y, towerNumber } = payload;
  const towerId = uuidv4();

  const newTower = {
    id: towerId,
    x: x,
    y: y,
    towerNumber: towerNumber,
    upgrade: 0,
  };

  const success = await towerManager.addTower(newTower.id, newTower);

  if (!success) {
    return { status: 'fail', message: '타워 추가 실패' };
  }

  return { status: 'success', tower: newTower };
};

export const upgradeTowerHandler = async (uuid, payload) => {
  const towerId = payload;
  const tower = await towerManager.getTower(towerId);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  tower.upgrade++;
  tower.attackPower += 10 * tower.upgrade;

  const success = await towerManager.updateTower(towerId, tower);

  if (!success) {
    return { status: 'fail', message: '타워 업그레이드 실패' };
  }

  return { status: 'success', tower: tower };
};

export const sellTowerHandler = async (uuid, payload) => {
  const towerId = payload;

  const tower = await towerManager.getTower(towerId);
  if (!tower) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  const success = await towerManager.removeTower(towerId);

  if (!success) {
    return { status: 'fail', message: '타워 판매 실패' };
  }

  return { status: 'success', message: '타워 판매 성공' };
};
