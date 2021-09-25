import Cryptr from 'cryptr';
import getAttrKey from './getAttrKey';
/**
 * Encrypt an Object & associated Attribute
 * @param {Object} obj to encrypt
 * @param {Boolean} encrypt or decrypt
 * @returns {Object}
 */
export const encryptObj = (obj, encrypt = true) => {
  let result = {};
  if (typeof obj === 'object') {
    const attrCryptr = new Cryptr(getAttrKey('attribute'));
    Object.keys(obj).forEach((atr) => {
      let objCryptr = {};
      if (!encrypt) {
        objCryptr = new Cryptr(getAttrKey(attrCryptr.decrypt(atr)));
      } else {
        objCryptr = new Cryptr(getAttrKey(atr));
      }
      const eAttr = encrypt
        ? attrCryptr.encrypt(atr)
        : attrCryptr.decrypt(atr);
      const eVal = encrypt
        ? objCryptr.encrypt(obj[atr])
        : objCryptr.decrypt(obj[atr]);
      result = {
        ...result,
        [eAttr]: eVal,
      };
    });
  }
  return result;
};

export default (val, eKey, encrypt = true) => {
  if (!eKey || eKey?.length < 1) return val;
  const cryptr = new Cryptr(eKey);
  try {
    return encrypt
      ? cryptr.encrypt(val)
      : cryptr.decrypt(val);
  } catch (e) {
    throw new Error(e);
  }
};
