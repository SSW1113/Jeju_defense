import { Monster } from "./monster.js";

export class HiddenMonster extends Monster {
  constructor(path, monsterImages, level) {
    super(path, monsterImages, level);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(
      `(레벨 ${this.level}) ${this.hp}/${this.maxHp}`,
      this.x,
      this.y - 5
    );
  }
}