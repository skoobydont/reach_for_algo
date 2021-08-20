export const commaFormat = (n) => {
  if (!n) return n;
  // TODO: comma
  return 'comma';
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
