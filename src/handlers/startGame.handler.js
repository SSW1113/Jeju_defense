import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const startGame = async (uuid, payload) => {
  // 유저의 전체 데이터를 Redis에서 가져오기
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  const userData = JSON.parse(userDataJSON);

  // 유저 데이터를 초기화
  userData.currentGold = 2000;  // 기존 currentGold 대신 gold로 통일
  userData.score = 0;
  userData.stage = 0;

  console.log(`Redis: 유저 ${uuid}의 골드 2000G로 초기화`);
  console.log(`Redis: 유저 ${uuid}의 점수 0으로 초기화`);
  console.log(`Redis: 유저 ${uuid}의 스테이지 0으로 초기화`);

  // 0번 스테이지 몬스터 수 가져오기
  const remainMonsters = serverAssetManager.getStageMonsterOrNull(0);
  
  // 유저 데이터 업데이트 (Redis에 저장)
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));
  
  // 클라이언트에 초기화된 데이터를 반환
  return { status: 'success', packetId: ePacketId.S2CStartGame, payload: { currentGold: userData.currentGold, score: userData.score, remainMonsters } };
};
