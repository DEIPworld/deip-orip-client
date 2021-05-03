import { AccessService } from '@deip/access-service';
import RecursiveIterator from 'recursive-iterator';
import { mergeDeep } from 'vuetify/lib/util/helpers';
import { isFile, isObject } from './verification';

const accessService = AccessService.getInstance();

export const compactAttributes = (
  attrs,
  idKey = 'attributeId',
  valueKey = 'value'
) => Object.keys(attrs)
  .map((id) => ({
    [idKey]: id,
    [valueKey]: attrs[id]
  }));

export const expandAttributes = (attrs) => attrs.reduce((res, attr) => ({ ...res, ...{ [attr.attributeId]: attr.value } }), {});

// TODO: switch to expand
export const tenantAttributesToObject = (attrs) => attrs.reduce((res, attr) => ({ ...res, ...{ [attr.attributeId || attr._id]: attr } }), {});

export const researchAttributeFileUrl = (
  researchExternalId,
  attributeId,
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
    attributeId,
    '/file/',
    filename,
    '?download=',
    download,
    '&image=',
    isImage
  ];
  return parts.join('');
};

export const userAttributeFileUrl = (
  username = 'initdelegate', width = 48, height, isRound = false, noCache = false
) => {
  const internalWidth = width * 2;
  const internalHeight = height ? height * 2 : internalWidth;

  const pathArray = [
    window.env.DEIP_SERVER_URL,
    '/api/user/avatar/',
    username,
    '/?authorization=',
    accessService.getAccessToken(),
    '&width=',
    internalWidth,
    '&height=',
    internalHeight,
    '&round=',
    isRound,
    '&noCache=',
    noCache
  ];

  return pathArray.join('');
};

export const teamAttributeFileUrl = (
  researchGroupExternalId, width = 48, height, isRound = false, noCache = true
) => {
  const internalWidth = width * 2;
  const internalHeight = height ? height * 2 : internalWidth;
  const id = researchGroupExternalId || null;

  const pathArray = [
    window.env.DEIP_SERVER_URL,
    '/api/groups/logo/',
    id,
    '/?authorization=',
    accessService.getAccessToken(),
    '&width=',
    internalWidth,
    '&height=',
    internalHeight,
    '&round=',
    isRound,
    '&noCache=',
    noCache
  ];

  return pathArray.join('');
};

export const extendAttrModules = (schema, obj = {}) => {
  const clone = _.cloneDeep(schema);

  for (const { node, parent, key } of new RecursiveIterator(clone, 1, true)) {
    if (isObject(node) && node.type === 'attribute') {
      parent[key] = mergeDeep(node, obj);
    }
  }
  return clone;
};

export const extractFilesFromAttributes = (obj) => {
  const res = [];

  for (const { node, path } of new RecursiveIterator(obj, 1, true)) {
    const attrId = path[0];

    if (isFile(node)) {
      res.push([attrId, node, `${attrId}-${node.name}`]);
    }
  }

  return res;
};
