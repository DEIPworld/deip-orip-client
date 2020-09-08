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

export const camelizeObjectKeys = (obj) => {
  if (!obj) return {};

  return Object.keys(obj)
    .reduce((o, key) => ({ ...o, ...{ [camelCase(key)]: obj[key] } }), {});
};

export const compareModels = (a, b) => JSON.stringify(a) === JSON.stringify(b);
