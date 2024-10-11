export const loadGameAssets = async () => {
    try {
      const [monsters, towers] = await Promise.all([
        // 이런 형태로 필요한 파일 로드
        readFileAsync('monster.json'),
        readFileAsync('tower.json')
      ]);
      gameAssets = { monsters, towers };
      return gameAssets;
    } catch (error) {
      throw new Error('Failed to load game assets: ' + error.message);
    }
  };
  
  export const getGameAssets = () => {
    return gameAssets;
  };
  
  export const getMonsterId = () => {};

  export const getTowerId = () => {};