import { ePacketId } from '../utils/packet.js';
import { redis } from '../utils/redis/index.js';

export const startGame = (uuid, payload) => {
  redis.set(`user:${uuid}:gold`, 2000);
  console.log(`Redis: 유저 ${uuid}의 골드 2000G로 초기화`);

  return { packetId: ePacketId.S2CStartGame, data: 2000 };
};
