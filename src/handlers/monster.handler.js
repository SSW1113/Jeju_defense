import { status } from "express/lib/response"

export const MonsterAttackHandler = (uuid, payload) => {
    const { monsterId, attackPower } = payload;

    const checkMonster = monsters.find((monster) => (monster) => monster.id === monsterId );
    
    if(!checkMonster){
        return {status: 'fail', message: 'invalid monster'}
    }

    

    return { status: 'success' }
}