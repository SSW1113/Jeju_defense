import { ePacketId, Packet } from './Packet.js';
import { CLIENT_VERSION } from './constants.js';
import { handlerEvent } from './handlers/helper.js';
import { assetManager } from './src/init/AssetManager.js';
import { towerManager } from './src/towerManager.js';
import { utils } from './utils/utils.js';

/*---------------------------------------------
    [Session 생성자]

    protocol: http
    domain: localhost
    port:3000
---------------------------------------------*/
class Session {
  constructor() {
    this.socket = null;
    this.userId = null;
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
  Init(protocol, domain, port) {
    this.connect(protocol, domain, port);
    // 이벤트 결과
    this.socket.on('response', (data) => {
      console.log('Client response:', data);
    });

    // 클라이언트가 서버와 연결될 때
    this.socket.on('connection', (data) => {
      console.log('connection: ', data);
      this.userId = data.uuid; // 서버에서 받은 UUID 저장

      this.sendEvent(ePacketId.StartGame);

      for(let i = 0; i < 2; i += 1){
        const position = utils.getRandomPositionNearPath(200);
        this.sendEvent(ePacketId.InitTower, {towerId: 0, position});
      }
    });

    //game asset받아오기
    this.socket.on('S2CInit',  (gameAssets) => {
      assetManager.setGameAssetsAndInit(gameAssets);
    });

    this.socket.on('event', async (data) => {
      console.log('genPacket', data);

      await handlerEvent(this.socket, data);
    });
  }

  /*-------------------------------------------------------------
    [패킷 전송]
    Packet(패킷ID, 유저ID, 클라이언트 버전, 내용)
-------------------------------------------------------------*/
  sendEvent(packetId, payload) {
    this.socket.emit('event', new Packet(packetId, this.userId, CLIENT_VERSION, payload));
  }

  connect(protocol, domain, port){
    this.socket = io.connect(`${protocol}://${domain}:${port}`, {
      cors: { origin: '*' },
    });
  }
}

export const session = new Session();