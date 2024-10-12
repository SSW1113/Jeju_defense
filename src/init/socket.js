import {Server as SocketIO} from "socket.io";
import registerHandler from "../handlers/register.handler.js";

/*---------------------------------------------
    [서버 소켓 초기화]

    protocol: http
    domain: localhost
    port:3000
---------------------------------------------*/
function initSocket(server, protocol, domain, port){
    const io = new SocketIO({
        cors: {
            origin: `${protocol}://${domain}:${port}`,
            methods: ["GET", "POST"]
        }
    });

    io.attach(server);

    registerHandler(io);
}

export default initSocket;