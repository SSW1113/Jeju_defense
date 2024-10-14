import { ePacketId } from '../Packet.js';
import { Session } from '../Session.js';
import { Base } from './base.js';
import { Monster } from './monster.js';
import { CoolTower, HotTower, StrongTower, Tower } from './tower.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/
//let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수
const NUM_OF_TOWERS = 4;

let userGold = 500000; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력

let towerCost = 0; // 타워 구입 비용

let numOfInitialTowers = 0; // 초기 타워 개수
let monsterLevel = 0; // 몬스터 레벨
let monsterSpawnInterval = 1000; // 몬스터 생성 주기
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImages = [];
for (let i = 1; i <= NUM_OF_TOWERS; i++) {
  const img = new Image();
  img.src = `images/tower${i}.png`;
  towerImages.push(img);
}

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

let monsterPath;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

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

function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? 
  */
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(x, y, towerCost, towerImages);
    towers.push(tower);
    tower.draw(ctx);
  }
}

function requestBuyTower(towerNumber) {
  console.log('requestBuyTower');
  const { x, y } = getRandomPositionNearPath(200);
  session.sendEvent(ePacketId.BuyTower, { towerNumber, x, y });
}

export const placeNewTower = (towerCost, position, towerId) => {
  const { x, y } = position;
  let tower;
  switch (towerCost) {
    case 1000:
      tower = new Tower(x, y, towerCost, towerImages, towerId);
      break;
    case 1500:
      tower = new CoolTower(x, y, towerCost, towerImages, towerId);
      break;
    case 2000:
      tower = new StrongTower(x, y, towerCost, towerImages, towerId);
      break;
    case 2500:
      tower = new HotTower(x, y, towerCost, towerImages, towerId);
      break;
  }

  console.log('tower: ', tower);

  userGold -= towerCost;

  towers.push(tower);
  tower.draw(ctx);
};

function requestUpgradeTower(towerId) {
  console.log('requestUpgradeTower');
  console.log('towerId: ', towerId);
  session.sendEvent(ePacketId.UpgradeTower, towerId);
}

export const upgradeTower = (towerId) => {
  const tower = towers.find((e) => e.id === towerId);
  tower.upgrade++;
  tower.attackPower += 10;
  userGold -= tower.upgradeCost;

  removeUI();
};

function requestSellTower(towerId) {
  console.log('requestSellTower');

  const tower = towers.find((e) => e.id === towerId);
  const sellPrice = (tower.cost + tower.upgrade * tower.upgradeCost) / 2;

  session.sendEvent(ePacketId.SellTower, { towerId, sellPrice });
}

export const sellTower = (towerId, sellPrice) => {
  userGold += sellPrice;

  const towerIndex = towers.findIndex((e) => e.id === towerId);
  const tower = towers[towerIndex];

  ctx.clearRect(tower.x, tower.y, tower.width, tower.height);
  towers.splice(towerIndex, 1);

  removeUI();

  towers.forEach((tower) => {
    tower.draw(ctx);
  });
};

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImages);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return;
  }

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

  canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    // 타워 리스트에서 클릭된 타워를 찾음
    const clickedTower = towers.find((tower) => tower.isClicked(mouseX, mouseY));

    if (clickedTower) {
      // 타워 클릭 처리
      clickTower(clickedTower);
    }
  });

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

var session;
// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  // new Promise((resolve) => (towerImage.onload = resolve)),
  ...towerImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  session = new Session('http', 'localhost', 3000);
  // let somewhere;
  // serverSocket = io("http://localhost:3000", {
  //   auth: {
  //     token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
  //   },
  // });

  //서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다!
  //e.g. serverSocket.on("...", () => {...});
  //이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다!
  if (!isInitGame) {
    initGame();
  }
});

// 버튼 만드는 함수
function createTowerButton(buttonName, towerNumber, positionTop, positionRight) {
  const button = document.createElement('button');
  button.textContent = buttonName;
  button.style.position = 'absolute';
  button.style.top = positionTop;
  button.style.right = positionRight;
  button.style.padding = '10px 20px';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => requestBuyTower(towerNumber));

  document.body.appendChild(button);
}

createTowerButton('하르방\n$1000', 0, '10px', '10px');
createTowerButton('쿨하르방\n$1500', 1, '60px', '10px');
// createTowerButton('강하르방\n$1500', 2, '110px', '10px'); // 광역공격 미구현
createTowerButton('핫하르방\n$2000', 3, '160px', '10px');

function clickTower(tower) {
  removeUI();

  createUpgradeButton(tower);
  createSellButton(tower);

  showTowerInfo(tower);
}

function createUpgradeButton(tower) {
  const upgradeButton = document.createElement('button');
  upgradeButton.textContent = `업그레이드\n$${tower.upgradeCost}`;
  upgradeButton.style.position = 'absolute';
  upgradeButton.style.left = `${tower.x + 320}px`; // 타워 좌표 기준으로 위치 설정
  upgradeButton.style.top = `${tower.y}px`;
  upgradeButton.style.padding = '10px';
  upgradeButton.style.fontSize = '12px';

  upgradeButton.addEventListener('click', () => requestUpgradeTower(tower.id));

  document.body.appendChild(upgradeButton);
}

function createSellButton(tower) {
  const sellButton = document.createElement('button');
  sellButton.textContent = `판매\n$${(tower.cost + tower.upgrade * tower.upgradeCost) / 2}`;
  sellButton.style.position = 'absolute';
  sellButton.style.left = `${tower.x + 320}px`; // 타워 좌표 기준으로 위치 설정
  sellButton.style.top = `${tower.y + 40}px`;
  sellButton.style.padding = '10px';
  sellButton.style.fontSize = '12px';

  // 판매 버튼 클릭 이벤트
  sellButton.addEventListener('click', () => requestSellTower(tower.id));

  document.body.appendChild(sellButton);
}

function showTowerInfo(tower) {
  const infoDiv = document.createElement('div');
  infoDiv.id = 'towerInfo';
  infoDiv.style.position = 'absolute';
  infoDiv.style.left = `${tower.x + 320}px`;
  infoDiv.style.top = `${tower.y - 40}px`;
  infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  infoDiv.style.color = 'white';
  infoDiv.style.padding = '10px';
  infoDiv.style.borderRadius = '5px';

  infoDiv.innerHTML = `
        Level: ${tower.upgrade}, Atk: ${tower.attackPower}<br>
    `;

  document.body.appendChild(infoDiv);
}

function removeUI() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (button.textContent.includes('업그레이드') || button.textContent.includes('판매')) {
      button.remove();
    }
  });

  const infoDiv = document.getElementById('towerInfo');
  if (infoDiv) {
    infoDiv.remove();
  }
}
