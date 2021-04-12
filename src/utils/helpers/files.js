import RecursiveIterator from 'recursive-iterator';
import { isFile } from '@/utils/helpers/verification';

export const toBase64 = (url) => fetch(url)
  .then((response) => response.blob())
  .then((blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

export const replaceFileWithName = (obj) => {
  const clone = _.cloneDeep(obj);

  for (const { node, parent, key } of new RecursiveIterator(clone)) {
    if (isFile(node)) {
      parent[key] = node.name;
    }
  }

  return clone;
};

export const fileNameFromUrl = (url) => {
  const matches = url.match(/\/([^/?#]+)[^/]*$/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
};
