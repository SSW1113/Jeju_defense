/*---------------------------------------------
    [PacketID]
      1. SyncGameState: 게임상태 동기화
      2. RecoverGameState: 상태 복구
      3. S2CGenMonster: 서버에게 받은 monsterd로 몬스터 생성
      4. StartGame: 게임 시작
      5. InitTower: 최초 타워 추가
      11. NextStage: 스테이지 클리어 
      12: BaseDamaged: 기지 피격 이벤트
      21. MonsterKill: 몬스터 처치
      31. BuyTower: 타워 구입
      32. SellTower: 타워 환불
      33. UpgradeTower: 타워 업그레이드
      40. S2CMonsterKill: 몬스터 처치(동기화)-점수, 골드, 남은 몬스터 수 update
      41. S2CBuyTower: 타워 구입(동기화)-서버에게 받은 towerId로 타워 생성
      42. S2CSellTower: 타워 환불(동기화)
      43. S2CUpgradeTower: 타워 업그레이드(동기화)
      44. S2CStartGame: 게임 시작(동기화)-서버에게 기본 골드, 점수, 남은 몬스터 수 update
      45. S2CInitTower: 최초 타워 추가(동기화)-서버에게 받은 towerId로 타워 생성
      46: S2CStageMove: 스테이지 클리어(동기화)-스테이지 클리어 보상 획득
      47. S2CBaseDamaged: 기지 피격 이벤트(동기화)
      48. S2CHiddenMonsterKill: 히든 몬스터 처치
      49. S2CBossMonsterKill: 보스 몬스터 처치

    [주의사항]  
        - 대문자로 시작하기
---------------------------------------------*/
export const ePacketId = {
  RecoverGameState: 2,
  S2CGenMonster: 3,
  StartGame: 4,
  InitTower: 5,
  NextStage: 11,
  BaseDamaged: 12,
  GameEnd: 13,
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
  S2CBaseDamaged: 47,
  S2CHiddenMonsterKill: 48,
  S2CBossMonsterKill: 49
};

export class Packet {
  constructor(packetId, userId, clientVersion, payload) {
    this.packetId = packetId; //요청을 처리할 서버 핸들러의 ID
    this.userId = userId; //요청을 보내는 유저의 ID
    this.clientVersion = clientVersion; //현재 클라이언트 버전 (”1.0.0”) (고정)
    this.payload = payload; // JSON 데이터, 요청 내용
  }
}
