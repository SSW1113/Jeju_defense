import { ePacketId, Packet } from "../utils/packet.js";
import { Monster } from "./monster.model.js";

class MonsterSpawner{
    constructor(session){
        this.session = session;
        this.spawnRate = 1000;
        this.interval = null;

        console.log("MonsterSpawner");

        this.startSpawning();
    }

    startSpawning(){
        this.interval = setInterval(() => {
            this.createMonster();  // 몬스터 생성
          }, this.spawnRate);
    }

    createMonster(){
        const newMon = new Monster();
        try {
            this.session.sendEvent(ePacketId.S2CGenMonster,  newMon);
            console.log("createMonster");
        } catch (error) {
            console.log(error);
        }
    }

    stopSpawning(){
        clearInterval(this.interval);
    }
}

class MonsterManager {
    constructor(){
        this.spawners = new Map();
    }

    async addSpanwer(session){
        try {
            this.spawners.set(session.getUuid(), new MonsterSpawner(session));
            console.log("addSpawner");
        } catch (error) {
            console.log(error);
        }
    };

    removeSpawner(uuid){
        try {
            this.spawners.get(uuid).stopSpawning();
            this.spawners.delete(uuid);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export const monsterManager = new MonsterManager();