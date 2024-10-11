import { monsterImages } from "../utils/monsterImages.js";
import { utils } from "../utils/utils.js";
import { Monster } from "./monster.js";

class MonsterManager{
    constructor(){
      this.monsters = [];
    }
     spawnMonster(monsterId, level, maxHp, hp, attackPower, speed, goldDrop){
      console.log("spawnMonster");
      this.monsters.push(new Monster(utils.getPath(), monsterImages, level, maxHp, hp, attackPower, speed, goldDrop));
    }
}

export const monsterManager = new MonsterManager;