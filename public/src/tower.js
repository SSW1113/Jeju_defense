export class Tower {
  constructor(towerInfo, position, towerImage, towerUuid) {
    /*---------------------------------------------
        [멤버 변수]
  ---------------------------------------------*/
    //능력치
    this.id = towerInfo.id;
    this.uuid = towerUuid;
    this.attackPower = towerInfo.attackPower; // 타워 공격력
    this.range = towerInfo.range; // 타워 사거리
    this.currentCooldown = 0; //현재 쿨타임
    this.cooldown = towerInfo.cooldown; // 타워 공격 쿨타임

    //위치
    this.x = position.x; // 타워 이미지 x 좌표
    this.y = position.y; // 타워 이미지 y 좌표

    //비용
    this.upgrade = 0; // 타워 업그레이드 상태
    this.cost = towerInfo.cost; // 타워 구입 비용
    this.upgradeCost = towerInfo.upgradeCost; // 기본 업그레이드 비용(500)

    //리소스
    this.image = towerImage;
    this.beamColor = towerInfo.beamColor;
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이

    //기타
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
  }

  /*---------------------------------------------
  [렌더링]
---------------------------------------------*/
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = this.beamColor;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  /*---------------------------------------------
  [타워 공격]
  - override하지 말것
  - speacialEffect() override하여 이벤트 처리(ex 쿨하르방의 슬로우...)
---------------------------------------------*/
  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.currentCooldown <= 0) {
      monster.hp -= this.attackPower + this.upgrade * 20;
      this.speacialEffect(monster);

      this.currentCooldown = this.cooldown; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  /*---------------------------------------------
  [타워 업그레이드]
---------------------------------------------*/
  upgradeTower() {
    console.log('타워 업그레이드');

    this.upgrade++;
  }

  /*---------------------------------------------
  [타워 쿨타임 계산]

  -공격 속도 계산 
---------------------------------------------*/
  updateCooldown() {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }
  /*---------------------------------------------
  [변경 시작]
---------------------------------------------*/
  isClicked(mouseX, mouseY) {
    console.log('isClicked');
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
  /*---------------------------------------------
  [변경 끝]
---------------------------------------------*/
  /*---------------------------------------------
  [특수 공격 처리]

  - 순수 가상함수
  - 특수 공격이 있는 타워들은 여기서 이벤트를 처리 
---------------------------------------------*/
  speacialEffect(monster) {}
}

export class NormalTower extends Tower {
  constructor(towerInfo, position, towerImage, towerUuid) {
    super(towerInfo, position, towerImage, towerUuid);
  }
}
// 슬로우 공격을 하는 타워 (쿨하르방)
export class CoolTower extends Tower {
  constructor(towerInfo, position, towerImage, towerUuid) {
    super(towerInfo, position, towerImage, towerUuid);

    this.slowEffect = 0.5; // 50% 슬로우
    this.slowDuration = 180;
  }

  /*---------------------------------------------
  [특수 공격 처리]

  - 적에게 슬로우 적용
---------------------------------------------*/
  speacialEffect(monster) {
    monster.applySlow(this.slowEffect, this.slowDuration);
  }
}

// 느린 광역 공격을 하는 타워 (강하르방)
export class StrongTower extends Tower {
  constructor(towerInfo, position, towerImage, towerUuid) {
    super(towerInfo, position, towerImage, towerUuid);
    this.splashRange = 200;
  }

  /*---------------------------------------------
  [특수 공격 처리]

  - 광역 공격 
---------------------------------------------*/
  speacialEffect(monster) {
    monster.applySplashDamage(monster, this.splashRange, this.attackPower);
  }
}

// 공속이 빠른 타워 (핫하르방)
export class HotTower extends Tower {
  constructor(towerInfo, position, towerImage, towerUuid) {
    super(towerInfo, position, towerImage, towerUuid);
  }
}
