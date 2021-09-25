import Cryptr from 'cryptr';
import getAttrKey from './getAttrKey';

export const encryptObj = (obj) => {
  let result = {};
  if (typeof obj === 'object') {
    const attrCryptr = new Cryptr(getAttrKey('attribute'));
    Object.keys(obj).forEach((atr) => {
      const objCryptr = new Cryptr(getAttrKey(atr));
      const eAttr = attrCryptr.encrypt(atr);
      const eVal = objCryptr.encrypt(obj[atr]);
      result = {
        ...result,
        [eAttr]: eVal,
      };
    });
  }
  return result;
};

export default (val, eKey) => {
  if (!eKey || eKey?.length < 1) return val;
  const cryptr = new Cryptr(eKey);
  try {
    return cryptr.encrypt(val);
  } catch (e) {
    throw new Error(e);
  }
};
