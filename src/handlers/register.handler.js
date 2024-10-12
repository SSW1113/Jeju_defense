import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

/*---------------------------------------------
    [ProcessConnect]

    - 클라가 연결된 이후 호출
    - uuid 생성 및 다양한 이벤트 소켓에 등록
---------------------------------------------*/
const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // uuid 생성
    const userUUID = uuidv4();

    // 클라에게 정상적으로 연결됐다고 알림
    handleConnection(socket, userUUID);

    // 사용자 정의 이벤트 등록
    socket.on('event', (data) => handlerEvent(io, socket, data));

    // 접속해제 이벤트 등록
    socket.on('disconnect', () => handleDisconnect(socket.id, userUUID));

    // 클라이언트가 게임을 시작할 때 호출하는 이벤트
    socket.on('startGame', () => {
      const initGold = 2000; // 지급할 골드 양
      const userId = socket.id;

      // Redis에 골드 데이터 추가
      client.set(`user:${userId}:gold`, initGold);

      // 클라이언트에 골드 데이터 전송
      const initData = { userGold: initGold };
      console.log('initGame 데이터', initData);
      socket.emit('initGame', initData);
    });

    // 클라이언트가 기본 타워 건설을 요청할 때 호출하는 이벤트
    socket.on('buildInitialTowers', () => {
      const userId = socket.id;
      const towers = [];

      // 무작위 위치 정하기
      for (let i = 0; i < 3; i++) {
        const x = Math.floor(Math.random() * 500);
        const y = Math.floor(Math.random() * 500);
        towers.push({ x, y });

        // Redis에 타워 위치 저장
        client.rpush(`user:${userId}:towers`, JSON.stringify({ x, y }));
      }

      // 클라이언트에게 타워 위치 전송
      socket.emit('initialTowers', towers);
    });
  });
};

export default registerHandler;
