export class Monster{
    constructor(monsterId, level, hp, attackPower, speed,  goldDrop){
        this.monsterId = monsterId
        this.maxHp = hp; // 몬스터의 최대 HP
        this.hp = hp; // 몬스터의 현재 HP
        this.attackPower = attackPower; // 몬스터의 공격력 (기지에 가해지는 데미지)
        this.level = level; // 몬스터 레벨
        this.speed = speed; // 몬스터의 이동 속도
        this.goldDrop = goldDrop
    }
}

//1. 마이크
export class Mike extends Monster{
    constructor(level){
        super(0, level, 100, 10, 1,  30);
    }
}

//2. 단데기
export class Metapod extends Monster{
    constructor(level){
        super(1, level, 200, 10, 1,  50);
    }
}

//3. 아구몬
export class Agumon extends Monster{
    constructor(level){
        super(2, level, 300, 10, 1,  100);
    }
}

//4. 티고라스
export class Tyrunt extends Monster{
    constructor(level){
        super(3, level, 350, 10, 2,  150);
    }
}

//5, 쥬벳
export class Zubat extends Monster{
    constructor(level){
        
        super(4, level, 300, 10, 3,  250);
    }
}