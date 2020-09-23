import { camelCase } from 'change-case';

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
