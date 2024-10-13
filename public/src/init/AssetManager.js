/*---------------------------------------------
    [Asset Manager]

        -목적: 게임 시작 시 서버로부터 받은 자원 관리
        -장점: 네트워크 부하 감소 및 유지보수(몬스터, 타워 능력치 변경 용이)
---------------------------------------------*/
class AssetManager{
    constructor(){
        this.monsters = new Array();
        this.towers = new Array();
    }

    setGameAssetsAndInit(gameAssets){
        this.monsters = gameAssets.monsters.data;
        this.towers = gameAssets.towers.data;
    }

/*---------------------------------------------
    [몬스터 능력치 반환]
        -목적: 몬스터 생성을 위해 monsterId에 맞는 능력치 반환
        -반환 정보: Array(maxHp, hp, attackPower, speed, goldDrop)
---------------------------------------------*/
    getMonsterStatOrNull(monsterId){
            return this.monsters[monsterId] || null;
    }

    getTowerStatOrNull(towerId){
        return this.towers[towerId] || null;
    }
}

export const assetManager = new AssetManager();