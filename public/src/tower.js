export class Tower {
  constructor(x, y, cost, towerImages) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.upgrade = 0; // 타워 업그레이드 상태
    this.upgradeCost = cost / 2; // 기본 업그레이드 비용 (구매 가격의 절반)
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = 40; // 타워 공격력
    this.range = 300; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.towerNumber = 0;
    this.image = towerImages[this.towerNumber];
    this.beamColor = 'yellow';
  }

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

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + this.upgrade * 10;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  isClicked(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}

// 슬로우 공격을 하는 타워 (쿨하르방)
export class CoolTower extends Tower {
  constructor(x, y, cost, towerImages, upgrade, upgradeCost) {
    super(x, y, cost, towerImages, upgrade, upgradeCost);
    this.attackPower = 40;
    this.range = 300;
    this.cooldown = 180;
    this.slowEffect = 0.5; // 50% 슬로우
    this.slowDuration = 180;
    this.towerNumber = 1;
    this.image = towerImages[this.towerNumber];
    this.beamColor = 'skyblue';
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + this.upgrade * 10;
      monster.applySlow(this.slowEffect, this.slowDuration);
      this.cooldown = 180;
      this.beamDuration = 30;
      this.target = monster;
    }
  }
}

// 느린 광역 공격을 하는 타워 (강하르방)
export class StrongTower extends Tower {
  constructor(x, y, cost, towerImages, upgrade, upgradeCost) {
    super(x, y, cost, towerImages, upgrade, upgradeCost);
    this.attackPower = 100;
    this.range = 400;
    this.cooldown = 0;
    this.splashRange = 200;
    this.towerNumber = 2;
    this.image = towerImages[this.towerNumber];
    this.beamColor = 'black';
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + this.upgrade * 10;
      monster.applySplashDamage(this.splashRange, this.attackPower);
      this.cooldown = 270;
      this.beamDuration = 30;
      this.target = monster;
    }
  }
}

// 공속이 빠른 타워 (핫하르방)
export class HotTower extends Tower {
  constructor(x, y, cost, towerImages, upgrade, upgradeCost) {
    super(x, y, cost, towerImages, upgrade, upgradeCost);
    this.attackPower = 60;
    this.range = 300;
    this.cooldown = 0;
    this.towerNumber = 3;
    this.image = towerImages[this.towerNumber];
    this.beamColor = 'red';
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + this.upgrade * 10;
      this.cooldown = 90;
      this.beamDuration = 30;
      this.target = monster;
    }
  }
}
