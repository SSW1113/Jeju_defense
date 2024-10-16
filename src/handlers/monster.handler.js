import { stageManager } from '../models/stage.model.js';
import { goldManager } from '../models/gold.model.js';
import { scoreManager } from '../models/score.model.js';
import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';

/*---------------------------------------------
    [몬스터 처치 핸들러]
---------------------------------------------*/
export const killMonsterHandler = async (userId, payload) => {

  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾기
  let currentStages = await stageManager.getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지(현재) ID 확인
  currentStages.sort((a, b) => a.stageId - b.stageId);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 (currentStage) vs 서버 (currentStage) 비교 로직
  if (currentStage.id !== payload.currentStage) {
    console.log("killMonsterHandler", payload);
    console.log("currentStage", currentStage);
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  const stages = serverAssetManager.getStages();

  // 현재 스테이지 데이터
  const currentStageData = stages.find((stage) => stage.id === currentStage.id);
  if (!currentStageData) {
    return { status: 'fail', message: 'Stage data not found' };
  }

  // 스테이지 별 점수, 골드 증가
  let goldToAdd = currentStageData.gold;
  let scoreToAdd = currentStageData.score;

  if (payload.remainHiddenMonsters !== undefined) {
    goldToAdd *= 2;
    scoreToAdd *= 2;
  } else if (payload.bossKilled !== undefined) {
    goldToAdd *= 3;
    scoreToAdd *= 3;
  }

  // 골드, 점수 증가
  await goldManager.earnGold(userId, goldToAdd);
  await scoreManager.addScore(userId, scoreToAdd);

  const currentGold = await goldManager.getGold(userId);
  const currentScore = await scoreManager.getScore(userId);

  // 남은 몬스터
  if (payload.remainMonsters !== undefined) {
    const remainMonsters = payload.remainMonsters - 1;
    return { status: 'success', packetId: ePacketId.S2CMonsterKill, payload: {gold: currentGold, score: currentScore, remainMonsters }};
  }

  // 남은 히든 몬스터
  if (payload.remainHiddenMonsters !== undefined) {
    const remainHiddenMonsters = payload.remainHiddenMonsters - 1;
    return { status: 'success', packetId: ePacketId.S2CMonsterKill, payload: {gold: currentGold, score: currentScore, remainHiddenMonsters }};
    // return {
    //   status: 'success',
    //   currentGold: currentGold,
    //   currentScore: currentScore,
    //   remainHiddenMonsters,
    // };
  }

  if (payload.bossKilled !== undefined) {
    const bossKilled = true;
    return { status: 'success', packetId: ePacketId.S2CMonsterKill, payload: {gold: currentGold, score: currentScore, bossKilled }};
    // return {
    //   status: 'success',
    //   currentGold: currentGold,
    //   currentScore: currentScore,
    //   bossKilled,
    // };
  }
};
