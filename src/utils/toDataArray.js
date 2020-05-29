export const toDataArray = (obj, keyMap) => {
  const result = [];
  for (const key of Object.keys(keyMap)) {
    if (obj[key]) {
      result.push({
        label: keyMap[key],
        text: obj[key]
      });
    }
  }
  return result;
};
