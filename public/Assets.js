let gameAssets = {};

export const loadGameAssets = (assets) => {
  try {
    gameAssets = {
      stages: assets.stages
    };

    console.log(gameAssets.stages);
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
