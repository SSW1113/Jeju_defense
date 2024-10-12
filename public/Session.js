import { Packet } from './Packet.js';
//import { CLIENT_VERSION } from './constants.js';

/*---------------------------------------------
    [Session 생성자]

    protocol: http
    domain: localhost
    port:3000
---------------------------------------------*/
export class Session {
  constructor(protocol, domain, port) {
    this.socket = io.connect(`${protocol}://${domain}:${port}`, {
      cors: { origin: '*' },
    });

    this.userId = null;
    this.Init();
  }

  /*---------------------------------------------
    [소켓 이벤트 설정]
    1. response: 
        helper::handleEvent()에서 이벤트 처리 결과(status)를 보내는 이벤트
    2. connection:
        클라이언트가 서버와 성공적으로 연결된 이벤트
    3. init:
        클라가 서버와 연결될 때, GameAssets을 보내주는 이벤트
---------------------------------------------*/
  Init() {
    // 이벤트 결과
    this.socket.on('response', (data) => {
      console.log('Server response:', data);
    });

    // 클라이언트가 서버와 연결될 때
    this.socket.on('connection', (data) => {
      console.log('connection: ', data);
      this.userId = data.uuid; // 서버에서 받은 UUID 저장
    });

    // 서버에서 골드 업데이트 이벤트 수신
    this.socket.on('initGame', (data) => {
      console.log('initGame 이벤트 수신:', data);
      window.userGold = data.userGold; // 서버에서 받은 골드 값을 전역 변수로 업데이트
      console.log('초기 골드:', window.userGold);

      // 기본 타워 건설 요청
      this.socket.emit('buildInitialTowers');
    });

    // 서버에서 초기 타워 위치 수신
    this.socket.on('initialTowers', (towers) => {
      console.log('initialTowers 이벤트 수신:', towers);
      placeInitialTowers(towers); // 타워 설치 함수 호출
    });
  }

  /*-------------------------------------------------------------
    [패킷 전송]
    Packet(패킷ID, 유저ID, 클라이언트 버전, 내용)
-------------------------------------------------------------*/
  sendEvent(packetId, payload) {
    this.socket.emit('event', new Packet(packetId, this.userId, CLIENT_VERSION, payload));
  }
}
