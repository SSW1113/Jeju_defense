import { CLIENT_VERSION } from "./constants.js";
import { Packet } from "./utils/packet.js";

/*---------------------------------------------
    [Session 생성자]

    protocol: http
    domain: localhost
    port:3000
---------------------------------------------*/
export class ClientSession {
    constructor(uuid, socket) {
        this.uuid = uuid
        this.socket = socket;
        this.Init();
    }

    getUuid(){
      return this.uuid;
    }
/*---------------------------------------------
    [소켓 이벤트 설정]
---------------------------------------------*/
    Init() {
    // 이벤트 결과
    this.socket.on('response', (data) => {
      console.log('Server response:', data);
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
