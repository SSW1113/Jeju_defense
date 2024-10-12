import { monsterImages } from "../utils/monsterImages.js";
import { utils } from "../utils/utils.js";
import { Monster } from "./monster.js";

class MonsterManager{
    constructor(){
      this.monsters = [];
    }
     spawnMonster(monsterId, level, maxHp, hp, attackPower, speed, goldDrop){
      console.log("spawnMonster", maxHp, hp, attackPower, speed, goldDrop);

      try {
        //constructor(path, monsterImages, level, maxHp, hp, attackPower, speed,  goldDrop) {
        let newMon = new Monster(utils.getPath(), monsterImages, monsterId, level, maxHp, hp, attackPower, speed, goldDrop);
        console.log(newMon);
    
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