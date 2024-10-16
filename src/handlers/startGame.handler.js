import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

/*---------------------------------------------
    [게임 시작]
    
    1. redis에서 유저 정보 가져오기
    2. 유저 데이터 초기화 및 redis에 저장
    3. 첫 번째 스테이지의 몬스터 수 가져오기
    4. 초기화된 데이터 반환
---------------------------------------------*/
export const startGame = async (uuid, payload) => {
  //1. redis에서 유저 정보 가져오기
  const userDataJSON = await redis.get(`user:${uuid}:data`);
  const userData = JSON.parse(userDataJSON);

  // 2. 유저 데이터 초기화
  userData.gold = 2000;  // 기존 currentGold 대신 gold로 통일
  userData.score = 0;
  userData.stage = 0;

  console.log(`Redis: 유저 ${uuid}의 골드 2000G로 초기화`);
  console.log(`Redis: 유저 ${uuid}의 점수 0으로 초기화`);
  console.log(`Redis: 유저 ${uuid}의 스테이지 0으로 초기화`);

  // 2. 유저 데이터 redis에 저장
  await redis.set(`user:${uuid}:data`, JSON.stringify(userData));

  // 3. 첫 번째 스테이지의 몬스터 수 가져오기
  const remainMonsters = serverAssetManager.getStageMonsterOrNull(0);
  
  // 4. 초기화된 데이터 반환(시작 골드, 점수, 첫 번째 스테이지의 몬스터 수)
  return { status: 'success', packetId: ePacketId.S2CStartGame, payload: { gold: userData.gold, score: userData.score, remainMonsters } };
};
