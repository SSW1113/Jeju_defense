import { baseManager } from "../models/base.model.js";

export const baseDamageHandler = async (uuid) => {
    baseManager.updateBaseHp(uuid);
    const getBaseHp = await baseManager.getBaseHp(uuid);

    console.log(getBaseHp);
    return { status: 'success', baseHp: getBaseHp };
};