import { serverAssetManager } from '../init/assets.js';
import { ePacketId, Packet } from '../utils/packet.js';

class MonsterSpawner {
  constructor(session, stageId) {
    this.session = session;
    this.stage = stageId;
    
    const stageInfo = serverAssetManager.getStageOrNull(stageId);
    
    this.spawnedMonster = 0; //생성된 몬스터 수
    this.stageMonsters = stageInfo.monster; // 생성할 총 몬스터 수
    this.spawnRate = stageInfo.monsterSpawnInterval; //몬스터 생성 간격
    this.interval = null;

    console.log("MonsterSpawner")
     this.startSpawning();
  }

  startSpawning() {
    
    this.interval = setInterval(() => {
      if(this.spawnedMonster < this.stageMonsters){
        this.createMonster(); //몬스터 생성
        this.spawnedMonster+=1;
      }
      else{
        this.stopSpawning();
      }
    }, this.spawnRate);
  }

  createMonster() {
    const monsterId = Math.floor(Math.random() * 5);
    try {
      this.session.sendEvent(ePacketId.S2CGenMonster, {monsterId, level: 1});
    } catch (error) {
      console.log(error);
    }
  }

  stopSpawning() {
    clearInterval(this.interval);
  }
}

class MonsterManager {
  constructor() {
    this.spawners = new Map();
  }

  async addSpanwer(session) {
    try {
      this.spawners.set(session.getUuid(), new MonsterSpawner(session, 0));
      console.log('addSpawner');
    } catch (error) {
      console.log(error);
    }
  }


  removeSpawner(uuid) {
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
