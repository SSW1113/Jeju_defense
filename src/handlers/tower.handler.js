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
  };

  const success = towerManager.addTower(newTower.id, newTower);

  if (!success) {
    return { status: 'fail', message: '타워 추가 실패' };
  }

  return { status: 'success', tower: newTower };
};

export const upgradeTowerHandler = async (uuid, payload) => {
  const { towerId } = payload;

  const towerData = towerManager.getTower(towerId);

  if (!towerData) {
    return { status: 'fail', message: '타워를 찾을 수 없습니다.' };
  }

  return { status: 'success', message: '타워 업그레이드 성공' };
};

export const sellTowerHandler = async (uuid, payload) => {
  const { towerId } = payload;

  const success = towerManager.removeTower(towerId);

  if (!success) {
    return { status: 'fail', message: '타워 판매 실패' };
  }

  return { status: 'success', message: '타워 판매 성공' };
};
