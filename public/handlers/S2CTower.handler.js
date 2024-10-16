import { scoreAndGoldManager } from '../src/ScoreAndGoldManager.js';
import { towerManager } from '../src/towerManager.js';

/*---------------------------------------------
    [몬스터 생성 이벤트]
    1. 서버로부터 monsterID, level수신 
    2. AssetManager에게 monsterId를 전달하여 능력치 가져오기
    3. 가져온 능력치와 monsterID에 mapping된 이미지를 사용해 몬스터 생성

    [TODO]  
    - monsterID가 유효한 값인지 검증하기
---------------------------------------------*/
export const S2CBuyTower = (uuid, payload) => {
  console.log('S2CBuyTower');
  towerManager.spawnTower(payload.towerId, payload.position, payload.towerUuid);
  scoreAndGoldManager.gold = payload.gold;
  return { status: 'success' };
};
/*---------------------------------------------
    [타워 업그레이드 이벤트]

    타워id랑
    tower.upgrade()
---------------------------------------------*/
export const S2CUpgradeTower = (uuid, payload) => {
  console.log('S2CUpgradeTower', payload);

  //towerManager에 타워가 존재하는지
  const tower = towerManager.getTower(payload.towerUuid);
  tower.upgradeTower();
  scoreAndGoldManager.gold -= payload.upgradCost;
  console.log('결과는', tower); //
  console.log('페이로드는', payload); //
  return { status: 'success' };
};

/*---------------------------------------------
    [타워 환불 이벤트]
---------------------------------------------*/
export const S2CSellTower = (uuid, payload) => {
  console.log('S2CUpgradeTower', payload);

  //towerManager에 타워가 존재하는지
  const tower = towerManager.getTower(payload.towerUuid);
  towerManager.removeTower(tower.uuid);

  scoreAndGoldManager.gold += payload.gold;
  console.log('결과는', tower);
  console.log('페이로드는', payload);
  return { status: 'success' };
};
