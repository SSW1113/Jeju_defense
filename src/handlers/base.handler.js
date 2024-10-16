import { serverAssetManager } from "../init/assets.js";
import { userManager } from "../models/user.model.js";
import { ePacketId } from "../utils/packet.js";

/*---------------------------------------------
    [타워 구입]

    1. redis에서 유저 정보 가져오기
    2. payload로 받은 towerId로 타워 비용 가져오기
    3. 유저의 골드로 살 수 있는지 검증
      3-1. 골드가 부족하면 { status: fail }반환
    4. redis에 변경사항 저장
      4-1. 골드 차감 
      4-2. payload로 받은 좌표
---------------------------------------------*/
export const baseDamagedHandler = async (uuid, payload) => {
    console.log("=============================" );
    console.log(payload);
    console.log("=============================" );
    const attackPower = serverAssetManager.getMonsterAttackPowerOrNull(payload);

    const baseHp = await userManager.attackedBase(uuid, attackPower);
    console.log("baseHP" );
    console.log(baseHp);
    console.log(attackPower);
    console.log("=============================" );
    return { status: 'success', packetId: ePacketId.S2CBaseDamaged, payload: { baseHp } };
  };