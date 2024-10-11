const BaseMaxHP = 20;

const userBase = {};

// 게임 시작 시 베이스 체력 초기화
export const initBase = (uuid) => {
  userBase[uuid] = BaseMaxHP;
};

// 베이스 체력 설정
export const setBaseHp = (uuid, baseHp) => {
  userBase[uuid] = baseHp;
};

// 베이스 체력 가져오기
export const getBaseHp = (uuid) => {
  return userBase[uuid];
};

// 베이스 정보 삭제
export const removeBase = (uuid) => {
  delete userBase.uuid;
};