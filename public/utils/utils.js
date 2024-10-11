class Utils{
  constructor(){
    this.canvas = null;
    this.path = [];
  }

  init(canvas){
    this.canvas = canvas;

    this.generateRandomMonsterPath();
  }

  getPath(){
    return this.path;
  }

  generateRandomMonsterPath() {
      let currentX = 0;
      let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)
    
      this.path.push({ x: currentX, y: currentY });
    
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
    
        this.path.push({ x: currentX, y: currentY });
      }
    }
}

export const utils = new Utils();