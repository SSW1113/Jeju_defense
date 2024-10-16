import { Utils } from "../utils/Utils.js";

/*---------------------------------------------
    [ServerAssetManager]

  -목적: game asset을 중앙에서 관리하기 위함
  -장점: 유지 보수 용이
---------------------------------------------*/
class ServerAssetManager{
    constructor(){
        this.towers = new Array();
        this.monsters = new Array();
        this.stages = new Array();
    }


/*---------------------------------------------
    [게임 에셋 불러오기]
---------------------------------------------*/
    async loadGameAssets(){
        try {
            const [towers, monsters, stages] = await Promise.all([
                Utils.readFileAsync("tower.json"),
                Utils.readFileAsync("monster.json"),
                Utils.readFileAsync("stage.json")
            ]);
            
            //타워 자원 로드
            this.towers = towers;
            //몬스터자원 로드
            this.monsters = monsters;
            //스테이지 자원 로드
            this.stages = stages;

            return {towers: this.towers, monsters: this.monsters};  
        } catch (error) {
            throw new Error("Faild to load game assets: " + error.message)
        }
    }

/*---------------------------------------------
    [getGameAssets]
    -클라 접속 시 전달하기 위함
---------------------------------------------*/
    getGameAssets(){
        return {towers: this.towers, monsters: this.monsters, stages: this.stages};  
    }

    getStages(){
      return this.stages.data;
    }

/*---------------------------------------------
    [getter 주의사항]
    - 이름 규칙: get+필요한 데이터+OrNull
---------------------------------------------*/
    getStageOrNull(stageId){
      return this.stages.data[stageId] || null;
    }

    getTowerCost(towerId){
      console.log(towerId);
      console.log(this.towers.data[towerId]);
      return this.towers.data[towerId].cost;
    }

    getUpgradeTowerUpgradeCost(towerId){
      console.log(towerId);
      console.log(this.towers.data[towerId]);
      return this.towers.data[towerId].upgradeCost;
    }

    getStageMonsterOrNull(stageId){
      return this.stages.data[stageId].monster || null;
    }

    getStageClearGoldOrNull(stageId){
      return this.stages.data[stageId].reward || null;;
    }

    getMonsterAttackPowerOrNull(monsterId){
      console.log(this.monsters.data);
      console.log(monsterId);
      return this.monsters.data[monsterId].attackPower || null;;
    }
}

export const serverAssetManager = new ServerAssetManager();
