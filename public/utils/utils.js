/*---------------------------------------------
    [몬스터 능력치 반환]
        -목적: 몬스터 생성을 위해 monsterId에 맞는 능력치 반환
        -반환 정보: Array(maxHp, hp, attackPower, speed, goldDrop)
---------------------------------------------*/
class Utils{
  constructor(){
    this.canvas = null;
    this.monsterPath = [];
  }

  init(canvas){
    this.canvas = canvas;

    this.generateRandomMonsterPath();
  }

  getPath(){
    return this.monsterPath;
  }

  generateRandomMonsterPath() {
      let currentX = 0;
      let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)
    
      this.monsterPath.push({ x: currentX, y: currentY });
    
      while (currentX < this.canvas.width) {
        currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
        // x 좌표에 대한 clamp 처리
        if (currentX > this.canvas.width) {
          currentX = this.canvas.width;
        }
    
        currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
        // y 좌표에 대한 clamp 처리
        if (currentY < 0) {
          currentY = 0;
        }
        if (currentY > this.canvas.height) {
          currentY = this.canvas.height;
        }
    
        this.monsterPath.push({ x: currentX, y: currentY });
      }
    }

  getRandomPositionNearPath(maxDistance) {
      // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
    const segmentIndex = Math.floor(Math.random() * (this.monsterPath.length - 1));
    const startX = this.monsterPath[segmentIndex].x;
    const startY = this.monsterPath[segmentIndex].y;
    const endX = this.monsterPath[segmentIndex + 1].x;
    const endY = this.monsterPath[segmentIndex + 1].y;
    const t = Math.random();
    const posX = startX + t * (endX - startX);
    const posY = startY + t * (endY - startY);
    const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
    const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

    return {
      x: posX + offsetX,
      y: posY + offsetY,
    };
  }

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
}

export const utils = new Utils();