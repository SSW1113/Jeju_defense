export class Monster{
    // constructor(level, hp, attackPower, speed,  goldDrop){
    //     this.monsterId = Math.floor(Math.random() * 5); // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
    //     this.maxHp = hp; // 몬스터의 최대 HP
    //     this.hp = hp; // 몬스터의 현재 HP
    //     this.attackPower = attackPower; // 몬스터의 공격력 (기지에 가해지는 데미지)
    //     this.level = level; // 몬스터 레벨
    //     this.speed = speed; // 몬스터의 이동 속도
    //     this.goldDrop = goldDrop
    // }
    constructor(l){
        this.monsterId = Math.floor(Math.random() * 5); // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
        this.maxHp = 100; // 몬스터의 최대 HP
        this.hp = 100; // 몬스터의 현재 HP
        this.attackPower = 1; // 몬스터의 공격력 (기지에 가해지는 데미지)
        this.level = 1; // 몬스터 레벨
        this.speed = 0.1; // 몬스터의 이동 속도
        this.goldDrop = 20
    }
}