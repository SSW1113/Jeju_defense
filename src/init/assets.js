import { readFileAsync } from '../utils/files/readFile.js';
import assets from '../utils/files/assetFiles.js';

let gameAssets = {};

/**
 * Promise.all()을 이용하여 게임 에셋 불러오기
 * @returns gameAssets - 게임 에셋
 */
export const loadGameAssets = async () => {
  try {
    const { stagesFile } = assets;

    const [stages] = await Promise.all([readFileAsync(stagesFile)]);

    gameAssets = { stages };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = async () => {
  return gameAssets;
};
