import { utils } from "../utils/utils.js";
import { assetManager } from "./init/AssetManager.js";

export class TowerFactory {
    static createTower(towerId, position) {
      
      switch (towerId) {
        case 0:
          return new Tower(level);  // 마이크 생성
        case 1:
          return new CoolTower(level);  // 쿨하르방 생성
        case 2:
          return new StrongTower(level);  // 강하르방 생성
        case 3:
          return new HotTower(level);  // 핫하르방 생성
        default:
          return null;
      }
    }
  }
  

/*---------------------------------------------
    [Tower Manager]

        -목적: 몬스터 생성 및 생성된 몬스터 관리
        -장점: 모듈화
---------------------------------------------*/
const NUM_OF_MONSTERS = 5; // 몬스터 개수

class TowerManager{
    constructor(){
        this.towers = new Array();
        this.towerImages = new Array();

        for (let i = 1; i <= NUM_OF_TOWERS; i++) {
            const img = new Image();
            img.src = `images/tower${i}.png`;
            towerImages.push(img);
        }
    }

    spawnTower(towerId, position){
        let newMonStat = assetManager.getMonsterStatOrNull(towerId);
        try {
            let newMon = new Monster(utils.getPath(), this.monsterImages[monsterId], monsterId, level, newMonStat.maxHp, newMonStat.hp, newMonStat.attackPower, newMonStat.speed, newMonStat.goldDrop);
    
            this.monsters.push(newMon);
        
        } catch (error) {
            console.log(error);
        }
    }
}

export const towerManager = new TowerManager;