import { ClientSession } from "../ClientSession.js";

class SessionManager{
    constructor(){
        this.sessios = new Map();
    }

    register(uuid, socket){
        console.log("register");
        let session = new ClientSession(uuid, socket);
        this.sessios.set(uuid, session);

        return session;
    }
}

export const sessionManager = new SessionManager();