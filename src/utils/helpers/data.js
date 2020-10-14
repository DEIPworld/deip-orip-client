import kindOf from 'kind-of';
import RecursiveIterator from 'recursive-iterator';
import { camelCase } from 'change-case';

// TYPES

export const isArray = (val) => kindOf(val) === 'array';
export const isObject = (val) => kindOf(val) === 'object';
export const isFile = (val) => kindOf(val) === 'file';

export const isBoolean = (val) => kindOf(val) === 'boolean';
export const isString = (val) => kindOf(val) === 'string';
export const isNumber = (val) => kindOf(val) === 'number';

export const isSimpleVal = (val) => ['boolean', 'string', 'number'].includes(kindOf(val));

// CHECKERS

export const hasValue = (value) => {
  if (!value) return false;

  const res = [];

  if (isSimpleVal(value)) {
    res.push(!!value);
  } else {
    for (const { node } of new RecursiveIterator(value)) {
      if (isSimpleVal(node)) {
        res.push(!!node);
      }
    }
  }

  return res.includes(true);
};

export const objectNotEmpty = (obj) => !!(obj && Object.keys(obj).length);

export const camelizeObjectKeys = (obj) => {
  if (!obj) return {};

  return Object.keys(obj)
    .reduce((o, key) => ({ ...o, ...{ [camelCase(key)]: obj[key] } }), {});
};

export const compareModels = (a, b) => {
  const a$ = kindOf(a) === 'string' ? a : JSON.stringify(a);
  const b$ = kindOf(b) === 'string' ? a : JSON.stringify(b);

  return a$ === b$;
};

export const hasOwnProperty = (prop, obj) => {
  if (kindOf(obj) !== 'object') return false;

  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// TRANSFORMERS

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

export const fileNameFromUrl = (url) => {
  const matches = url.match(/\/([^/?#]+)[^/]*$/);
  if (matches.length > 1) {
    return matches[1];
  }
  return null;
};

export const replaceFileWithName = (obj) => {
  const clone = _.cloneDeep(obj);

  for (const { node, parent, key } of new RecursiveIterator(clone)) {
    if (isFile(node)) {
      parent[key] = node.name;
    }
  }

  return clone;
};

export const padStart = (str, length, char = '0') => {
  const str$ = `${str}`;
  return char.repeat(Math.max(0, length - str$.length)) + str$;
}
