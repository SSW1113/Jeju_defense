export class Monster {
    /*---------------------------------------------
        [생성자]
    ---------------------------------------------*/
  constructor(path, monsterImages, monsterId, level, maxHp, hp, attackPower, speed,  goldDrop) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }
    
    /*---------------------------------------------
        [멤버 변수]
    ---------------------------------------------*/
    //능력치
    this.monsterId = monsterId; // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
    this.maxHp = maxHp; // 몬스터의 최대 HP
    this.hp = hp; // 몬스터의 현재 HP
    this.attackPower = attackPower; // 몬스터의 공격력 (기지에 가해지는 데미지)
    this.level = level; // 몬스터 레벨
    this.speed = speed // 몬스터의 이동 속도
    this.goldDrop = goldDrop; //드랍골드
    this.baseSpeed = this.speed; // 몬스터의 원래 속도

    this.speedReduction = 1; // 슬로우 정도 (1이 기본 이동속도)
    this.slowDuration = 0; // 슬로우 지속시간

    this.nearbyMonsters = []; // 근처 몬스터들
    
    //위치
    this.path = path; // 몬스터가 이동할 경로
    this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
    this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)

    //리소스
    this.width = 80; // 몬스터 이미지 가로 길이
    this.height = 80; // 몬스터 이미지 세로 길이
    this.image = monsterImages[this.monsterId]; // 몬스터 이미지
    this.init(level);
  }

  /*---------------------------------------------
    [몬스터 능력치 레벨 보정]
---------------------------------------------*/
  init(level) {
    this.maxHp += 10 * level; // 몬스터의 현재 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.attackPower +=  level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  }

  // 슬로우 적용
  applySlow(slowEffect, slowDuration) {
    this.speedReduction = 1 - slowEffect;
    this.slowDuration = slowDuration;
  }

  updateSpeed() {
    if (this.slowDuration > 0) {
      // 슬로우가 묻으면 속도 감소
      this.slowDuration--;
      this.speed = this.baseSpeed * this.speedReduction;
    } else {
      // 슬로우가 끝나면 원래 속도로 복구
      this.speedReduction = 1;
      this.speed = this.baseSpeed;
    }
  }

  // 자신 주변의 몬스터들에게도 데미지를 줌
  applySplashDamage(splashRange, attackPower) {
    const nearbyMonsters = this.getNearbyMonsters(splashRange);
    nearbyMonsters.forEach((monster) => {
      monster.hp -= attackPower;
    });
  }

  // 자신 splashRange 내의 몬스터들의 배열을 반환
  getNearbyMonsters(splashRange) {
    const nearbyMonsters = [];
    const x = this.x;
    const y = this.y;

    monsters.forEach((monster) => {
      const distance = Math.sqrt(Math.pow(monster.x - x, 2) + Math.pow(monster.y - y, 2));

      if (distance <= splashRange && monster !== target) {
        nearbyMonsters.push(monster);
      }
    });

    return nearbyMonsters;
  }

  move(base) {
    this.updateSpeed(); // 슬로우 확인

    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      // 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < this.speed) {
        // 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
        this.currentIndex++;
      } else {
        // 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
        this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
        this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
      }
      return false;
    } else {
      const isDestroyed = base.takeDamage(this.attackPower); // 기지에 도달하면 기지에 데미지를 입힙니다!
      this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
      return isDestroyed;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);

    if (this.slowDuration > 0) {
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 40, 0, Math.PI * 2);
      ctx.strokeStyle = 'lightblue';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.closePath();
    }
  }
}
