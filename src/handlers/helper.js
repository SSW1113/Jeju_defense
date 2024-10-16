import { CLIENT_VERSION } from '../constants.js';
import { userManager } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

/*---------------------------------------------
    [OnConnected]

    1. redis에 uuid를 키 값으로 갖는 빈 배열 생성
    2. 클라에게 connection이벤트 발생
---------------------------------------------*/
export const handleConnection = async (socket, uuid) => {
  console.log(`User Connected: ${uuid} with SocketID ${socket.id}`);

  //1. redis에 uuid를 키 값으로 갖는 빈 배열 생성
  await userManager.addUser(uuid);

  //2. 클라에게 connection이벤트 발생
  socket.emit(`connection`, { uuid });
};

/*---------------------------------------------
    [OnDisconnected]

    1. redis에 uuid를 키 값으로 갖는 데이터 삭제
---------------------------------------------*/
export const handleDisconnect = async (socketID, uuid) => {
  console.log(`User disconnected: ${socketID}`);

  //1. redis에 uuid를 키 값으로 갖는 데이터 삭제
  userManager.removeUser(uuid);
};

/*---------------------------------------------
    [Dispatch]

    1. 클라이언트 버전이 서버에서 지원하는 버전 목록에 포함되어 있는지 확인
        1-1. 버전이 일치하지 않는 경우 클라이언트에 오류 메시지 전송
    2. 패킷 ID에 해당하는 핸들러 확인
        2-1. 핸들러가 존재하지 않을 경우 오류 처리
    3. 핸들러를 호출하여 응답 생성
    4. 클라이언트에 결과 전송
---------------------------------------------*/
export const handlerEvent = async (io, socket, data) => {
  //1. 클라이언트 버전이 지원되는지 확인
  if (!CLIENT_VERSION.includes(data.clinetVersion)) {
    socket.emit('responese', { status: 'fail', message: 'Client version mismatch' });
  }

  console.log(data);

  //2. 패킷 ID에 해당하는 핸들러 확인
  const handler = handlerMappings[data.packetId];

  //2-1. 핸들러가 존재하지 않을 경우 오류 처리
  if (!handler) {
    console.log('data.packetId: ', data.packetId);
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  //3. 핸들러를 호출하여 응답 생성
  const response = await handler(data.userId, data.payload);

  console.log(response);
  //4. 클라이언트에 결과 전송
  if(response.status == 'success'){
    socket.emit('event', response); 
  }

  else if(response.status =='fail'){
    socket.emit('response', response);
  }
  else{
    console.log('response의 status값을 제대로 입력', response);
  }
};
