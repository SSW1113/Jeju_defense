import { utils } from "../utils/utils.js";
import { assetManager } from "./init/AssetManager.js";
import { Monster } from "./monster.js";

/*---------------------------------------------
    [Monster Manager]

        -목적: 몬스터 생성 및 생성된 몬스터 관리
        -장점: 모듈화
---------------------------------------------*/
const NUM_OF_MONSTERS = 5; // 몬스터 개수

class MonsterManager{
    constructor(){
      this.monsters = new Array();
      this.monsterImages= new Array();

      for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
        const img = new Image();
        img.src = `images/monster${i}.png`;
        this.monsterImages.push(img);
      }
    }
     spawnMonster(monsterId, level){
      let newMonStat = assetManager.getMonsterStatOrNull(monsterId);
      try {
        let newMon = new Monster(utils.getPath(), this.monsterImages[monsterId], monsterId, level, newMonStat.maxHp, newMonStat.hp, newMonStat.attackPower, newMonStat.speed, newMonStat.goldDrop);
    
        this.monsters.push(newMon);
        
      } catch (error) {
        console.log(error);
      }
    }

    getMonsters(){
      return this.monsters;
    }
}

export const monsterManager = new MonsterManager;