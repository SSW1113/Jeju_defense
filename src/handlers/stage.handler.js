import { stageManager } from "../models/stage.model.js";
import { goldManager } from "../models/gold.model.js";
import { serverAssetManager } from "../init/assets.js";
import { ePacketId } from "../utils/packet.js";
import { monsterManager } from "../models/monsterSpawner.model.js";

/**
 * 스테이지 이동 핸들러
 * @param userId
 * @param payload
 */
export const moveStageHandler = async (userId, payload) => {

  console.log("moveStageHandler", payload)

  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾기
  let currentStages = await stageManager.getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인
  currentStages.sort((a, b) => a.stageId - b.stageId);
  const currentStage = currentStages[currentStages.length - 1];

  
  console.log('클라이언트: ', payload.stageId);
  console.log('서버: ', currentStage.id);
  // 클라이언트 (currentStage) vs 서버 (currentStage) 비교 로직
  if (currentStage.id !== payload.stageId) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증 로직
  const serverTime = Date.now();


  //////////// 몬스터 처치 점수 로직 추가 //////////////


 // 다음 스테이지(nextStage) 존재  확인
 const nextStageInfo = serverAssetManager.getStageOrNull(payload.stageId+1);
  if (!nextStageInfo) {
    return { status: 'fail', message: 'Next Stage does not exist' };
  }

  // redis에 스테이지 클리어 정보 기록
  await stageManager.setStage(
    userId,
    nextStageInfo.id,
    nextStageInfo.gold,
    nextStageInfo.score,
    serverTime,
  );


  // 스테이지 클리어 보상

  const goldToAdd = serverAssetManager.getStageClearGoldOrNull(payload.stageId);
  if (!goldToAdd) {
    return { status: 'fail', message: 'StageID가 유효하지 않습니다.' };
  }

  await goldManager.earnGold(userId, goldToAdd);
  const currentGold = await goldManager.getGold(userId);

  // 업데이트된 현재 스테이지
  const stageData = await stageManager.getStage(userId);
  stageData.sort((a, b) => a.stageId - b.stageId);
  const currentStageData = stageData[stageData.length - 1];

  // 로그 체크
  //console.log('Stage: ', currentStageData);

  //몬스터 스폰
  monsterManager.startSpawn(userId, payload.stageId+1);

  return { status: 'success', packetId: ePacketId.S2CStageMove, payload: {currentStage: payload.stageId+1, gold: currentGold, remainMonsters: nextStageInfo.monster}};
};