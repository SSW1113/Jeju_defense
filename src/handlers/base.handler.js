import { BaseManager} from "../models/base.model";

export const BaseDamageHandler = (uuid, payload) => {
    const { baseHp } = payload;

    BaseManager.updateBaseHp(uuid);
    const getBaseHp = BaseManager.getBaseHp(uuid);

    return { status: 'success', baseHp: getBaseHp };
};