import { removeBase } from "../models/base.model.js";
import { UserManager } from "../models/user.model.js"

export const gameEndHandler = (uuid, payload) => {
    //점수 체크
    /*
        let FinalScore = 0;
    
        FinalScore = StageScore + SpawnScore;
    
        if (score !== FinalScore) {
            return { status: 'fail', message: 'Score mismatch' };
        }
    */
    //최고점수 갱신
    const user = UserManager.getUser(uuid);
    if (score > user.highScore) {
        UserManager.newHighScore(uuid, score);
        return { status: 'success', highScore: score };
    }

    return { status: 'success' };
}