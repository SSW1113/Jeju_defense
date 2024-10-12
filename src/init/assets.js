import { Utils } from "../Utils.js";

class ServerAssetManager{
    constructor(){
        this.towers = new Array();
        this.monsters = new Array();    
    }

    async loadGameAssets(){
        try {
            const [stages, itemMap, itemSpawn] = await Promise.all([
                Utils.readFileAsync("tower.json"),
                Utils.readFileAsync("monster.json")
            ]);
            
            //스테이지 자원 로드
            this.stages = stages;

            //아이템 자원 로드
            this.itemMap["version"] = itemMap.version;
            itemMap.data.forEach(item => {
                this.itemMap[item.id] = item.score;
              });
            
            this.itemSpawn = itemSpawn;
            
            console.log(this.itemSpawn, "testdd");
            return {stages: this.stages, itemMap: this.itemMap, itemSpawn: this.itemSpawn};  
        } catch (error) {
            throw new Error("Faild to load game assets: " + error.message)
        }
    }

    getGameAssets(){
        return {stages: this.stages, itemMap: this.itemMap, itemSpawn: this.itemSpawn};
    }

    getScorePerSecond(stageIndex){
        return this.stages.data[stageIndex].scorePerSecond;
    }

    getItemScore(itemId){
        try {
            return this.itemMap[itemId];
        } catch (error) {
            return null;
        }
    }

    getItemSpawnOrNull(stageIndex){
        try {
            let ret = this.itemSpawn.data[stageIndex].items;
            return ret;
        } catch (error) {
            return null;
        }
    }
}

export const serverAssetManager = new ServerAssetManager();