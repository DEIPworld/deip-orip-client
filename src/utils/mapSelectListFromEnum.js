
export const mapSelectListFromEnum = (enumObj, { blackList, allowBlank, blankLabel } = {}) => {
  const result = [];

  if (allowBlank) {
    result.push({
      text: blankLabel,
      value: ""
    });
  }

  return Object.keys(enumObj).reduce((acc, key) => {

    if (blackList.some(k => k == key) || typeof enumObj[key] !== 'string') {
      return acc;
    }

    let label = (enumObj[key][0] + enumObj[key].slice(1).toLowerCase()).replace('_', ' ');

    return [ ...acc, { text: label, value: key } ];
    
  }, result);
}