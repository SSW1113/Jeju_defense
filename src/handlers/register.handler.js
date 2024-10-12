import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";
import { sessionManager } from "../models/session.model.js";
import { monsterManager } from "../models/monsterSpawner.model.js";

/*---------------------------------------------
    [ProcessConnect]

    - 클라가 연결된 이후 호출
    - uuid 생성 및 다양한 이벤트 소켓에 등록
---------------------------------------------*/

const registerHandler = (io) =>{
    io.on('connection', (socket)=>{
        
        //uuid 생성
        const userUUID = uuidv4();

        //클라에게 정상적으로 연결됐다고 알림
        handleConnection(socket, userUUID);

        
        //사용자 정의 이벤트 등록
        socket.on('event', (data)=>handlerEvent(io, socket, data));
        
        //접속해제 이벤트 등록
        socket.on('disconnect', ()=>handleDisconnect(socket.id, userUUID));
        
        let session = sessionManager.register(userUUID, socket);
        monsterManager.addSpanwer(session)
    })
}

export default registerHandler;
