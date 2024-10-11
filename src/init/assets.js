export const loadGameAssets = async () => {
    try {
      const [game, monster, stage, tower, monster_unlock] = await Promise.all([
        readFileAsync('game.json'),
        readFileAsync('monster.json'),
        readFileAsync('stage.json'),
        readFileAsync('tower.json')
      ]);
      gameAssets = { game, monster, stage, tower};
      return gameAssets;
    } catch (error) {
      throw new Error('Failed to load game assets: ' + error.message);
    }
  };
  
  export const getGameAssets = () => {
    return gameAssets;
  };