import { Utils } from "../utils/Utils.js";


class ServerAssetManager{
    constructor(){
        this.towers = new Array();
        this.monsters = new Array();    
    }

    async loadGameAssets(){
        try {
            const [towers, monsters] = await Promise.all([
                Utils.readFileAsync("tower.json"),
                Utils.readFileAsync("monster.json")
            ]);
            
            //타워 자원 로드
            this.towers = towers;

            //몬스터자원 로드
            this.monsters = monsters;

            console.log(this.monsters);

            return {towers: this.towers, monsters: this.monsters};  
        } catch (error) {
            throw new Error("Faild to load game assets: " + error.message)
        }
    }

    getGameAssets(){
        return {towers: this.towers, monsters: this.monsters};  
    }
}

export const serverAssetManager = new ServerAssetManager();