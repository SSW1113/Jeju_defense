/*---------------------------------------------
    [ScoreAndGoldManager]

        -목적: 유저의 골드, 점수, 최고 점수 기록
        -장점: 모듈화
---------------------------------------------*/
class ScoreAndGoldManager{
    constructor(){
        this.gold = 0;
        this.highScore = 0;
        this.score = 0;
    }
}

export const scoreAndGoldManager = new ScoreAndGoldManager;