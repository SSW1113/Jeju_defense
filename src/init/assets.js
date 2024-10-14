import { Utils } from "../utils/Utils.js";


class ServerAssetManager{
    constructor(){
        this.towers = new Array();
        this.monsters = new Array();
        this.stages = new Array();
    }

    /**
     * Promise.all()을 이용하여 게임 에셋 불러오기
     * @returns gameAssets - 게임 에셋
     */
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

    getGameAssets(){
        return {towers: this.towers, monsters: this.monsters, stages: this.stages};  
    }

    getStages(){
      return this.stages.data;
    }

    getStageOrNull(stageId){
      return this.stages.data[stageId] || null;
    }

    getTowerCost(towerId){
      return this.towers.data[towerId].cost;
    }

    getStageMonsterOrNull(stageId){
      return this.stages.data[stageId].monster || null;
    }

    getStageClearGoldOrNull(stageId){
      return this.stages.data[stageId].reward || null;;
    }
}

export const serverAssetManager = new ServerAssetManager();