import { ePacketId } from "../Packet.js";
import { session } from "../Session.js";
import { utils } from "../utils/utils.js";
import { assetManager } from "./init/AssetManager.js";
import { CoolTower, HotTower, NormalTower, StrongTower, Tower } from "./tower.js";

const NUM_OF_TOWERS = 4;

/*---------------------------------------------
    [Tower Factory]

        -목적: 타워 생성 로직 캡슐화
        -장점: 유연성과 확장성 향상
---------------------------------------------*/
export class TowerFactory {
    static createTower(towerId, position, towerImage, towerUuid) {
      const newTower = assetManager.getTowerStatOrNull(towerId);

      switch (towerId) {
        case 0:
          return new NormalTower(newTower, position, towerImage, towerUuid);  // 기본 타워 생성
        case 1:
          return new CoolTower(newTower, position, towerImage, towerUuid);  // 쿨하르방 생성
        case 2:
          return new StrongTower(newTower, position, towerImage, towerUuid);  // 강하르방 생성
        case 3:
          return new HotTower(newTower, position, towerImage, towerUuid);  // 핫하르방 생성
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
            this.towerImages.push(img);
        }
    }

    getTower(towerUuid){
      for(let tower of this.towers){
        if(tower.uuid == towerUuid){
          console.log("ㅇㅇ");
          return tower;
        }
      }
      console.log(this.towers);
    }

    spawnTower(towerId, position, towerUuid){
        try {
            let newTower = TowerFactory.createTower(towerId, position, this.towerImages[towerId], towerUuid);
            this.towers.push(newTower);
        
        } catch (error) {
            console.log(error);
        }
    }

    requestBuyTower(towerId){
        console.log("requestBuyTower")
        const position = utils.getRandomPositionNearPath(200);

        console.log(position, "si");
        session.sendEvent(ePacketId.BuyTower, {towerId, position});
    }

    requestUpgradeTower(towerId, towerUuid){
      console.log('requestUpgradeTower');
      console.log('towerId: ', towerId);
      
      session.sendEvent(ePacketId.UpgradeTower, {towerUuid, towerId});
    }
}

export const towerManager = new TowerManager;