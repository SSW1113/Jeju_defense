import { stageManager } from "../models/stage.model.js";
import { getGameAssets } from "../init/assets.js";

/**
 * 스테이지 이동 핸들러
 * @param userId
 * @param payload
 */
export const moveStageHandler = async (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾기
  let currentStages = await stageManager.getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인
  currentStages.sort((a, b) => a.stageId - b.stageId);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 (currentStage) vs 서버 (currentStage) 비교 로직
  if (currentStage.id !== payload.currentStage.id) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  const { stages } = await getGameAssets();

  // 점수 검증 로직
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  const startScore = currentStage.score;
  const clientScore = payload.score;

  //////////// 몬스터 처치 점수 로직 추가 //////////////

  // 경과 시간(elapsedTime)에 따라 예상 점수 계산
  // const expectedScore = startScore + elapsedTime;

  /*
  // 클라이언트 점수 vs 서버 점수 비교 (오차 5)
  const tolerance = 5;

  // 오차 범위 벗어나면 fail
  if (Math.abs(expectedScore - clientScore) > tolerance) {
    return { status: 'fail', message: 'Invalid Score' };
  }
  */

  // 게임 에셋에서 다음 스테이지(nextStage)의 존재 여부 확인
  if (!stages.data.some((stage) => stage.id === payload.nextStage.id)) {
    return { status: 'fail', message: 'Next Stage does not exist' };
  }

  // 유저의 스테이지 정보 업데이트
  await stageManager.setStage(
    userId,
    payload.nextStage.id,
    payload.nextStage.score,
    serverTime,
  );

  const stageData = await stageManager.getStage(userId);
  // 로그 체크
  console.log('Stage: ', stageData);

  return { status: 'success', currentStage: stageData.id };
};