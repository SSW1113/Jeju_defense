import { Session } from '../Session.js';
import { Base } from './base.js';
import { Monster } from './monster.js';
import { HiddenMonster } from './hiddenMonster.js';
import { Tower } from './tower.js';
import { ePacketId } from '../Packet.js';
import { getGameAssets } from '../Assets.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/
//let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let base; // 기지 객체
let baseHp = 0; // 기지 체력

let towerCost = 0; // 타워 구입 비용
let numOfInitialTowers = 0; // 초기 타워 개수
let monsterLevel = 0; // 몬스터 레벨 - 스테이지
let monsterSpawnInterval = 5000; // 몬스터 생성 주기
const monsters = [];
const towers = [];

const hiddenMonsters = [];
let remainHiddenMonsters = 0;

let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

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

// 스테이지 관련
let stages = null;
let currentStage = null;
let nextStage = null;
let stageCleared = false;

// 서버 관리 (점수, 골드, 스테이지 등)
let userGold = 0; // 유저 골드
let score = 0; // 게임 점수
let remainMonsters = Infinity; // 남은 몬스터 숫자
let stageMonsters = Infinity; // 스테이지 몬스터 숫자

export const setCurrentStage = (newCurrentStage) => {
  currentStage = newCurrentStage;
};
export const setUserGold = (newGold) => {
  userGold = newGold;
};
export const setScore = (newScore) => {
  score = newScore;
};
export const setRemainMonsters = (newRemainMonsters) => {
  remainMonsters = newRemainMonsters;
};
export const setRemainHiddenMonsters = (newRemainHiddenMonsters) => {
  remainHiddenMonsters = newRemainHiddenMonsters;
};

export const getCurrentStage = () => currentStage;
export const getUserGold = () => userGold;
export const getScore = () => score;
export const getRemainMonsters = () => remainMonsters;
export const getRemainHiddenMonsters = () => remainHiddenMonsters;

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
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
  }
}

function placeNewTower() {
  /* 
    타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
    빠진 코드들을 채워넣어주세요! 
  */
  const { x, y } = getRandomPositionNearPath(200);
  const tower = new Tower(x, y);
  towers.push(tower);
  tower.draw(ctx, towerImage);
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  // 스테이지 당 몬스터 숫자 제한
  if (stageMonsters > 0) {
    monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));
    stageMonsters--;
  }
}

function spawnHiddenMonster() {
  hiddenMonsters.push(new HiddenMonster(monsterPath, monsterImages, monsterLevel * 2));
  remainHiddenMonsters++;
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
  ctx.fillStyle = 'red';
  ctx.fillText(`남은 몬스터: ${remainMonsters}`, 100, 250); // 현재 스테이지 남은 몬스터
  ctx.fillStyle = 'red';
  ctx.fillText(`남은 히든 몬스터: ${remainHiddenMonsters}`, 100, 300); // 현재 스테이지 남은 히든 몬스터

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });

    hiddenMonsters.forEach((monster) => {
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

      // 서버로 몬스터 처치 요청 (payload: currentStage, remainMonsters)
      session.sendEvent(ePacketId.MonsterKill, { currentStage, remainMonsters });
    }
  }

  for (let i = hiddenMonsters.length - 1; i >= 0; i--) {
    const hiddenMonster = hiddenMonsters[i];
    if (hiddenMonster.hp > 0) {
      const isDestroyed = hiddenMonster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        location.reload();
      }
      hiddenMonster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      hiddenMonsters.splice(i, 1);

      // 서버로 몬스터 처치 요청 (payload: currentStage, remainHiddenMonsters)
      session.sendEvent(ePacketId.HiddenMonsterKill, { currentStage, remainHiddenMonsters });
    }
  }

  if (remainMonsters === 0 && remainHiddenMonsters === 0 && !stageCleared) {
    // 다음 스테이지 서버로 요청(payload: currentStage, nextStage, score)
    session.sendEvent(ePacketId.NextStage, {
      currentStage: currentStage,
      nextStage: nextStage,
      score,
    });

    stageCleared = true;
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

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

export function initStage() {
  const gameAssets = getGameAssets();
  if (!gameAssets || Object.keys(gameAssets).length === 0) {
    console.log('아직 게임 에셋이 로드되지 않았습니다.');
    return;
  }

  stages = gameAssets.stages.data;
  if (Array.isArray(stages) && stages.length > 0) {
    //console.log('게임 에셋 불러와서 스테이지 할당:', stages);

    // 초기화
    currentStage = stages[0];
    nextStage = stages[1];
    monsterLevel = stages[0].id;
    remainMonsters = stages[0].monster;
    stageMonsters = stages[0].monster;
    monsterSpawnInterval = stages[0].monsterSpawnInterval;
  } else {
    console.error('스테이지 데이터를 불러올 수 없습니다. stages:', stages);
    currentStage = null;
  }
}

export function updateCurrentStage() {
  monsterLevel = currentStage.id;
  remainMonsters = currentStage.monster;
  stageMonsters = currentStage.monster;
  monsterSpawnInterval = currentStage.monsterSpawnInterval;

  // 현재 스테이지 인덱스로 다음 스테이지 인덱스 할당
  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStage.id);
  const nextStageIndex = currentStageIndex + 1;

  // 다음 스테이지 존재 시
  if (nextStageIndex < stages.length) {
    nextStage = stages[nextStageIndex];

    stageCleared = false;
  } else {
    // 마지막 스테이지일 경우
    console.log('더 이상 다음 스테이지가 없습니다.');
  }
}

var session;
// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
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

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);

document.body.appendChild(buyTowerButton);

function spawnHiddenMonsterButton(buttonName, onClickCallBack, positionTop, positionRight) {
  const button = document.createElement('button');
  button.textContent = buttonName;
  button.style.position = 'absolute';
  button.style.top = positionTop;
  button.style.right = positionRight;
  button.style.padding = '10px 20px';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', onClickCallBack);

  document.body.appendChild(button);
}

spawnHiddenMonsterButton('히든 몬스터 소환', spawnHiddenMonster, '60px', '10px');
