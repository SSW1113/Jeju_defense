import { utils } from "../utils/utils.js";
import { assetManager } from "./init/AssetManager.js";
import { MonsterManager } from "./monsterManager.js";
import { Monster } from "./monster.js";
import { session } from "../Session.js";
import { ePacketId } from "../Packet.js";

class HiddenMonsterManager extends MonsterManager {
  constructor() {
    super();

    this.monsterImages = [];
    for (let i = 1; i <= 1; i++) {
      const img = new Image();
      img.src = `images/gold_monster.png`;
      this.monsterImages.push(img);
    }
  }

  spawnMonster(monsterId, level) {
    console.log('체크: ', monsterId, '     ' , level);
    // 스탯을 조정
    const newMonStat = assetManager.getHiddenMonsterStatOrNull(monsterId);
    console.log(newMonStat);
    const adjustedMaxHp = newMonStat.maxHp * 2;
    const adjustedHp = newMonStat.hp * 2;
    const adjustedAttackPower = newMonStat.attackPower + 5; 
    const adjustedGoldDrop = newMonStat.goldDrop * 2;

    try {
      const newMon = new Monster(
        utils.getPath(),
        this.monsterImages[0], // 금색 몬스터 이미지 사용
        monsterId,
        level,
        adjustedMaxHp,
        adjustedHp,
        adjustedAttackPower,
        newMonStat.speed,
        adjustedGoldDrop
      );

      this.monsters.push(newMon);
      
      session.sendEvent(ePacketId.SpawnHiddenMonster, { monsterId, level });
    } catch (error) {
      console.log(error);
    }
  }
}

export const hiddenMonsterManager = new HiddenMonsterManager;