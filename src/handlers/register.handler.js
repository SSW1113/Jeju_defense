import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import { sessionManager } from '../models/session.model.js';
import { monsterManager } from '../models/monsterSpawner.model.js';
import { serverAssetManager } from '../init/assets.js';

/*---------------------------------------------
    [ProcessConnect]

    - 클라가 연결된 이후 호출
    - uuid 생성 및 다양한 이벤트 소켓에 등록
    - 모듈화와 확장성을 위해 connection패킷과 S2CInit패킷 2개를 전송
---------------------------------------------*/

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    //uuid 생성
    const userUUID = uuidv4();

      //클라에게 정상적으로 연결됐다고 알림
      handleConnection(socket, userUUID);

      //초기화(Game Assets정보 보내주기)
      const gameAssets = serverAssetManager.getGameAssets();
      socket.emit('S2CInit', gameAssets);


    //사용자 정의 이벤트 등록
    socket.on('event', (data) => handlerEvent(io, socket, data));

    //접속해제 이벤트 등록
    socket.on('disconnect', () => handleDisconnect(socket.id, userUUID));

    let session = sessionManager.register(userUUID, socket);
    monsterManager.addSpanwer(session);
  });
};

export default registerHandler;
