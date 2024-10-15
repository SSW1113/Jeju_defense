/*---------------------------------------------
    [PacketID]
        1. SyncGameState: 게임상태 동기화
        2. RecoverGameState: 게임 상태 복구(이어하기)
        3. 몬스터 생성(서버->클라)

    [주의사항] 
        - 대문자로 시작하기
        -S2C: Server->Client 전송
        -C2S: Client->Sever전송
---------------------------------------------*/
export const ePacketId = {
  RecoverGameState: 2,
  S2CGenMonster: 3,
  StartGame: 4,
  InitTower: 5,
  NextStage: 11,
  MonsterKill: 21,
  BuyTower: 31,
  SellTower: 32,
  UpgradeTower: 33,
  S2CMonsterKill: 40,
  S2CBuyTower: 41,
  S2CSellTower: 42,
  S2CUpgradeTower: 43,
  S2CStartGame: 44,
  S2CInitTower: 45,
  S2CStageMove: 46,
  BaseDamaged: 51
};

export class Packet {
  constructor(packetId, userId, clientVersion, payload) {
    this.packetId = packetId; //요청을 처리할 서버 핸들러의 ID
    this.userId = userId; //요청을 보내는 유저의 ID
    this.clientVersion = clientVersion; //현재 클라이언트 버전 (”1.0.0”) (고정)
    this.payload = payload; // JSON 데이터, 요청 내용
  }
}
