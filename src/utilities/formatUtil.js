/**
 * Comma Format
 * @param {Number} n to format
 * @returns {String} number value with commas
 */
export const commaFormat = (n) => {
  if (!n) return n;
  return String(n)?.split('')?.reverse()?.map((char, i) => {
    if (i % 3 === 0 && i !== 0) {
      return `${char},`;
    }
    return char;
  })?.reverse()?.join('');
}
/**
 * Capitalize
 * @param {string} s some camel case string probably
 * @returns {string} Capitalize Case String With Spaces
 */
export const capitalize = (s) => {
  const upperCase = s.substring(0, 1).toUpperCase() + s.substring(1);
  const reg = /([A-Z])/g;
  return upperCase.replace(reg, ' $1');
}

export const dollarFormat = (n) => `$${n}`;

export default dollarFormat;
