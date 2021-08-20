/**
 * Display Address
 * @param {object} address 
 * @returns {string} formatted address string based on passed obj
 */
const displayAddress = (address) => {
  if (!address) return '';
  if (Object?.keys(address) < 1) return address;
  let result = '';
  Object.keys(address).map((addr, i) => (
    result += `${
      address[addr]?.length > 0
        ? i > 0
          ? `, ${address[addr]}`
          : `${address[addr]}`
        : ''
    }`
  ));
  return result;
}

export default displayAddress;
