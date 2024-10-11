const NUM_OF_MONSTERS = 5; // 몬스터 개수

export const monsterImages = [];

for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}