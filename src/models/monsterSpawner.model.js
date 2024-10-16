import { serverAssetManager } from '../init/assets.js';
import { ePacketId, Packet } from '../utils/packet.js';

class MonsterSpawner {
  constructor(session) {
    this.session = session;

    this.spawnedMonster = 0; //생성된 몬스터 수
    this.stageMonsters = null; // 생성할 총 몬스터 수
    this.spawnRate = null; //몬스터 생성 간격
    this.interval = null;

    console.log('MonsterSpawner');
  }

  startSpawning(stageId) {
    const stageInfo = serverAssetManager.getStageOrNull(stageId);
    console.log(stageInfo, 'stageInfo', stageId);
    this.spawnedMonster = 0; //생성된 몬스터 수
    this.stageMonsters = stageInfo.monster; // 생성할 총 몬스터 수
    this.spawnRate = stageInfo.monsterSpawnInterval; //몬스터 생성 간격

    this.interval = setInterval(() => {
      console.log('monsterLog: ', this.spawnedMonster, this.stageMonsters);
      if (this.spawnedMonster < this.stageMonsters) {
        this.createMonster(stageInfo.id); //몬스터 생성
        this.spawnedMonster += 1;
      } else {
        this.stopSpawning();
      }
    }, this.spawnRate);
  }

  createMonster(level) {
    const monsterId = Math.floor(Math.random() * 5);
    try {
      // 몬스터 소환 (임시로 stage.id로 대체)
      this.session.sendEvent(ePacketId.S2CGenMonster, { monsterId, level: level });
    } catch (error) {
      console.log(error);
    }
  }

  stopSpawning() {
    this.spawnedMonster = 0;
    this.spawnedMonster = 0;
    clearInterval(this.interval);
  }
}

class MonsterManager {
  constructor() {
    this.spawners = new Map();
  }

  addSpanwer(session) {
    try {
      this.spawners.set(session.uuid, new MonsterSpawner(session));
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

  startSpawn(uuid, stageId) {
    console.log('startSpawning', stageId);
    try {
      this.spawners.get(uuid).startSpawning(stageId);
      console.log('startSpawning true');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export const monsterManager = new MonsterManager();
