import { Agumon, Metapod, Mike, Tyrunt, Zubat } from "../models/monster.model.js";


export class MonsterFactory {
  static createMonster(monsterId, level=1) {
    console.log("monsterId", monsterId)
    switch (monsterId) {
      case 0:
        return new Mike(level);  // 마이크 생성
      case 1:
        return new Metapod(level);  // 단데기 생성
      case 2:
        return new Agumon(level);  // 아구몬 생성
      case 3:
        return new Tyrunt(level);  // 티고라스 생성
      case 4:
        return new Zubat(level);  // 쥬벳 생성
      default:
        return null;
    }
  }
}
