import { AccessService } from '@deip/access-service';
import RecursiveIterator from 'recursive-iterator';
import { mergeDeep } from 'vuetify/lib/util/helpers';
import { isFile, isObject } from './verification';
import { ATTR_SCOPES } from '@/variables';

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
export const portalAttributesToObject = (attrs) => attrs.reduce((res, attr) => ({ ...res, ...{ [attr.attributeId || attr._id]: attr } }), {});

export const attributeFileUrl = (
  scope,
  entityId,
  attributeId,
  filename,
  isImage = false,
  download = false,
  width,
  height,
  isRound = false,
  noCache = true
) => {
  const sizeQuery = [];
  if (width) {
    const internalWidth = width * 2;
    const internalHeight = height ? height * 2 : internalWidth;
    sizeQuery.push(`&width=${internalWidth}`, `&height=${internalHeight}`);
  } else if (scope === ATTR_SCOPES.USER || scope === ATTR_SCOPES.TEAM) {
    const internalWidth = width ? width * 2 : 96;
    const internalHeight = height ? height * 2 : internalWidth;
    sizeQuery.push(`&width=${internalWidth}`, `&height=${internalHeight}`);
  }

  const pathArray = [
    window.env.DEIP_SERVER_URL,
    '/api/attribute/file/',
    `${scope}/`,
    `${entityId}/`,
    `${attributeId}/`,
    `${filename}`,
    '/?authorization=',
    accessService.getAccessToken(),
    '&round=',
    isRound,
    '&noCache=',
    noCache,
    '&download=',
    download,
    '&image=',
    isImage,
    ...sizeQuery
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
