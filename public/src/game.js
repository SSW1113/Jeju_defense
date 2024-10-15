import { ePacketId } from '../Packet.js';
import { session } from '../Session.js';
import { utils } from '../utils/utils.js';
import { Base } from './base.js';
import { monsterManager } from './monsterManager.js';
import { scoreAndGoldManager } from './ScoreAndGoldManager.js';
import { towerManager } from './towerManager.js';
/*
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/
const canvas = document.getElementById('gameCanvas');
utils.init(canvas);
const ctx = canvas.getContext('2d');

let base; // 기지 객체
let baseHp = 0; // 기지 체력

let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const baseImage = new Image();
baseImage.src = 'images/base.png';
const pathImage = new Image();
pathImage.src = 'images/path.png';

let monsterPath; //initGame에서 초기화

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

/*---------------------------------------------
    [변경 시작]
---------------------------------------------*/
// 타워 업그레이드 요청
function requestUpgradeTower(towerId) {
  console.log('requestUpgradeTower');
  console.log('towerId: ', towerId);
  session.sendEvent(ePacketId.UpgradeTower, towerId);
}

// 타워 업그레이드
export const upgradeTower = (towerId) => {
  const tower = towers.find((e) => e.id === towerId);
  tower.upgrade++;
  tower.attackPower += 10;
  userGold -= tower.upgradeCost;

  removeUI();
};

// 타워 판매 요청
function requestSellTower(towerId) {
  console.log('requestSellTower');

  const tower = towers.find((e) => e.id === towerId);
  const sellPrice = (tower.cost + tower.upgrade * tower.upgradeCost) / 2;

  session.sendEvent(ePacketId.SellTower, { towerId, sellPrice });
}

// 타워 판매
export const sellTower = (towerId, sellPrice) => {
  const towerIndex = towers.findIndex((e) => e.id === towerId);
  const tower = towers[towerIndex];

  ctx.clearRect(tower.x, tower.y, tower.width, tower.height);
  towers.splice(towerIndex, 1);
  userGold += sellPrice;
  removeUI();

  towers.forEach((tower) => {
    tower.draw(ctx);
  });
};

/*---------------------------------------------
    [변경 끝]
---------------------------------------------*/

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${scoreAndGoldManager.highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${scoreAndGoldManager.score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${scoreAndGoldManager.gold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${scoreAndGoldManager.monsterLevel}`, 100, 200); // 최고 기록 표시
  ctx.fillStyle = 'red';
  ctx.fillText(`남은 몬스터: ${scoreAndGoldManager.remainMonsters}`, 100, 250); // 현재 스테이지 남은 몬스터


  // 타워 그리기 및 몬스터 공격 처리
  towerManager.towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();
    monsterManager.getMonsters().forEach((monster) => {
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
  for (let i = monsterManager.monsters.length - 1; i >= 0; i--) {
    const monster = monsterManager.monsters[i];
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

      monsterManager.monsters.splice(i, 1);
      // 서버로 몬스터 처치 요청 (payload: currentStage)
      const remainMonsters= scoreAndGoldManager.remainMonsters;
      const currentStage = scoreAndGoldManager.monsterLevel;

      session.sendEvent(ePacketId.MonsterKill, { currentStage, remainMonsters });
    }
  }


  if (scoreAndGoldManager.remainMonsters === 0) {
    // 다음 스테이지 서버로 요청(payload: currentStage, nextStage, score)
    console.log(scoreAndGoldManager);

    
    session.sendEvent(ePacketId.NextStage, {
      stageId: scoreAndGoldManager.monsterLevel,
      score: scoreAndGoldManager.score
    });
  }
  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}
function initGame() {
  if (isInitGame) {
    return;
  }
  console.log("initGame");
  monsterPath = utils.getPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)

  //placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

/*---------------------------------------------
    [변경 시작]
---------------------------------------------*/
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

/*---------------------------------------------
    [변경 끝]
---------------------------------------------*/
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  ...towerManager.towerImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterManager.monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(async () => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  console.log('try connect');
  session.Init('http', 'localhost', 3000);
  await session.waitForGameAssets();
  console.log("dd");

  // serverSocket = io("http://localhost:3000", {
  //   auth: {
  //     token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
  //   },
  // });
  //서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다!
  //e.g. serverSocket.on("...", () => {...});

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

  button.addEventListener('click', onClickCallBack);
/*---------------------------------------------
    [변경 시작]
---------------------------------------------*/
  button.addEventListener('click', () => requestBuyTower(towerNumber));
/*---------------------------------------------
    [변경 끝]
---------------------------------------------*/
  document.body.appendChild(button);
}
createTowerButton('하르방\n$1000', ()=>towerManager.requestBuyTower(0), '10px', '10px');
createTowerButton('쿨하르방\n$1500', ()=>towerManager.requestBuyTower(1), '60px', '10px');
//createTowerButton('강하르방\n$1500', ()=>towerManager.requestBuyTower(2), '110px', '10px'); // 광역공격 미구현
createTowerButton('핫하르방\n$2000', ()=>towerManager.requestBuyTower(3), '160px', '10px');

/*---------------------------------------------
    [변경 시작]
---------------------------------------------*/
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
/*---------------------------------------------
    [변경 끝]
---------------------------------------------*/
