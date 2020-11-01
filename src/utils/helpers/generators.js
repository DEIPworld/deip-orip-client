import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};
