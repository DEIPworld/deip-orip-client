import RecursiveIterator from 'recursive-iterator';
import { mergeDeep } from 'vuetify/lib/util/helpers';
import { isFile, isObject } from './data';

export const compactResearchAttributes = (
  attrs,
  idKey = 'researchAttributeId',
  valueKey = 'value'
) => Object.keys(attrs)
  .map((id) => ({
    [idKey]: id,
    [valueKey]: attrs[id]
  }));

export const expandResearchAttributes = (attrs) => {
  return attrs.reduce((res, attr) => {
    return { ...res, ...{ [attr.researchAttributeId]: attr.value } };
  }, {});
};

// TODO: switch to expand
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

export const researchAttributeFileUrl = (
  researchExternalId,
  researchAttributeId,
  filename,
  isImage = false,
  download = false
) => {
  const parts = [
    window.env.DEIP_SERVER_URL,
    '/api',
    '/research/',
    researchExternalId,
    '/attribute/',
    researchAttributeId,
    '/file/',
    filename,
    '?download=',
    download,
    '&image=',
    isImage
  ];
  return parts.join('');
};

export const extendAttrModules = (schema, obj = {}) => {
  const clone = _.cloneDeep(schema);

  for (const { node, parent, key } of new RecursiveIterator(clone)) {
    if (isObject(node) && node.type === 'attribute') {
      parent[key] = mergeDeep(node, obj);
    }
  };
  return clone;
};

export const extractFilesFromAttributes = (obj) => {
  const res = [];

  for (const { node, key } of new RecursiveIterator(obj)) {
    if (isFile(node)) {
      res.push([key, node, `${key}-${node.name}`]);
    }
  }

  return res;
};
