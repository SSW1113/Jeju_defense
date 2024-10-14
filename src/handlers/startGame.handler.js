import { serverAssetManager } from '../init/assets.js';
import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const startGame = (uuid, payload) => {
  redis.set(`user:${uuid}:gold`, 2000);
  console.log(`Redis: 유저 ${uuid}의 골드 2000G로 초기화`);

  // 유저 점수 0으로 초기화
  redis.set(`user:${uuid}:score`, 0);
  console.log(`Redis: 유저 ${uuid}의 점수 0으로 초기화`);

  // 유저 스테이지 1로 초기화
  redis.set(`user:${uuid}:stage`, 0);
  console.log(`Redis: 유저 ${uuid}의 스테이지 0로 초기화`);

  //0번 스테이지 몬스터 수 가져오기
  const remainMonsters = serverAssetManager.getStageMonsterOrNull(0);
  return { status: 'success', packetId: ePacketId.S2CStartGame, payload: {currentGold: 2000,  remainMonsters}};
};
