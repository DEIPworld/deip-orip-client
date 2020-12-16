import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';

export const camelizeObjectKeys = (obj) => {
  if (!obj) return {};
  return Object.keys(obj)
    .reduce((o, key) => ({ ...o, ...{ [camelCase(key)]: obj[key] } }), {});
};

export const excludeObjectKeys = (obj, keys = []) => {
  if (!keys.length) return obj;

  const filtered = {};

  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      filtered[key] = obj[key];
    }
  }

  return filtered;
};

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};
