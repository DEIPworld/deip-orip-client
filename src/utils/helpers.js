import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';

export const compactResearchAttributes = (attrs) => {
  return Object.keys(attrs)
    .map((researchAttributeId) => ({
      researchAttributeId,
      value: attrs[researchAttributeId]
    }));
};

export const expandResearchAttributes = (attrs) => {
  return attrs.reduce((res, attr) => {
    return { ...res, ...{ [attr.researchAttributeId]: attr.value } };
  }, {});
};

export const researchAttributesToObject = (attrs) => {
  return attrs.reduce((res, attr) => {
    return { ...res, ...{ [attr.researchAttributeId]: attr } };
  }, {});
};

export const tenantAttributesToObject = (attrs) => {
  return attrs.reduce((res, attr) => {
    return { ...res, ...{ [attr._id]: attr } };
  }, {});
};

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`).toString(16), '');
};

export const camelizeObjectKeys = (obj) => {
  if (!obj) return {};

  return Object.keys(obj)
    .reduce((o, key) => ({ ...o, ...{ [camelCase(key)]: obj[key] } }), {});
};

export const compareModels = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const toBase64 = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
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

export const objectNotEmpty = (obj) => (obj && Object.keys(obj).length);

export const routerView = { template: '<router-view />' };

export const routeNameGenerator = (namespace, parent) => ({
  get(name) {
    return [
      ...(parent ? [parent] : []),
      namespace,
      ...(name ? [name] : [])
    ].join('.');
  }
});

export const stripHtml = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
