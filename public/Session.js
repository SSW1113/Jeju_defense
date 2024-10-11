
import { handlerEvent } from './handlers/helper.js';
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
      cors: {origin: "*" }

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

    this.socket.on('event', (data)=>{
      console.log('genPacket', data);

      handlerEvent(this.socket, data);

    })
  }

/*-------------------------------------------------------------
    [패킷 전송]
    Packet(패킷ID, 유저ID, 클라이언트 버전, 내용)
-------------------------------------------------------------*/
  sendEvent(packetId, payload) {
    this.socket.emit('event', new Packet(packetId, this.userId, CLIENT_VERSION, payload));
  } 
}
