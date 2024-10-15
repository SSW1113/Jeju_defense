import { Monster } from './monster.js';

export class BossMonster extends Monster {
  constructor(path, monsterImages, level) {
    super(path, monsterImages, level);

    this.width = 160; // 몬스터 이미지 가로 길이
    this.height = 160; // 몬스터 이미지 세로 길이
  }

  draw(ctx) {
    const adjustedX = this.x - this.width / 2;
    const adjustedY = this.y - this.height / 2;

    ctx.drawImage(this.image, adjustedX, adjustedY, this.width, this.height);

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(`(보스 레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);
  }
}
