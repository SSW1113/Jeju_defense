import { getBaseHp, setBaseHp } from "../models/base.model";

export const BaseDamageHandler = (uuid, payload) => {
    const { baseHp } = payload;

    if (getBaseHp(uuid) < baseHp) {
        return { status: 'fail', message: 'base HP mismatch' };
    }

    setBaseHp(baseHp);

    return { status: 'success', message: 'base damaged' };
};