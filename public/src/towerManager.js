import { utils } from "../utils/utils.js";
import { assetManager } from "./init/AssetManager.js";

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

    spawnTower(towerId){
        let newMonStat = assetManager.getMonsterStatOrNull(monsterId);
        try {
            let newMon = new Monster(utils.getPath(), this.monsterImages[monsterId], monsterId, level, newMonStat.maxHp, newMonStat.hp, newMonStat.attackPower, newMonStat.speed, newMonStat.goldDrop);
    
            this.monsters.push(newMon);
        
        } catch (error) {
            console.log(error);
        }
    }
}

export const towerManager = new TowerManager;