import { genMonster } from "./genMonster.handler.js";

  /*---------------------------------------------
    [사용자 정의 이벤트 콜백 함수]
    3. genMonster: 서버로부터 받은 monsterID를 통해 몬스터 생성
---------------------------------------------*/
const handlerMappings = {
    3 : genMonster,
};

export default handlerMappings