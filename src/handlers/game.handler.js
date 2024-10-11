import { redis } from "../utils/redis/index.js";

export const gameEnd = (uuid, payload) => {
    const { score } = payload;
    //HP 체크
    const baseHp = getBaseHp();
    if (baseHp > 0) {
        return { status: 'fail', message: 'Base HP remains' };
    }
    //점수 체크
    let FinalScore = 0;

    FinalScore = StageScore + SpawnScore;

    if (score !== FinalScore) {
        return { status: 'fail', message: 'Score mismatch' }
    }

    if (score > redis.HighScore) {
        
    }

    return { status: 'success' };
}