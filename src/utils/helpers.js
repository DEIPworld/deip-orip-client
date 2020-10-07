import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';
import kindOf from 'kind-of';

import { getObjectValueByPath } from 'vuetify/lib/util/helpers';
import RecursiveIterator from 'recursive-iterator';

// ATTRIBUTES

export const compactResearchAttributes = (
  attrs,
  idKey = 'researchAttributeId',
  valueKey = 'value'
) => {
  return Object.keys(attrs)
    .map((id) => ({
      [idKey]: id,
      [valueKey]: attrs[id]
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


// GENERATORS

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`).toString(16), '');
};

// OBJECTS

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

export const objectNotEmpty = (obj) => !!(obj && Object.keys(obj).length);

// DATA

export const isArray = (val) => kindOf(val) === 'array';
export const isObject = (val) => kindOf(val) === 'object';
export const isFile = (val) => kindOf(val) === 'file';

export const isBoolean = (val) => kindOf(val) === 'boolean';
export const isString = (val) => kindOf(val) === 'string';
export const isNumber = (val) => kindOf(val) === 'number';

export const isSimpleVal = (val) => ['boolean', 'string', 'number'].includes(kindOf(val));

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

export const hasOwnProperty = (prop, obj) => {
  if (kindOf(obj) !== 'object') return false;

  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// ROUTER

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

// STORE

export const getActionMapKey = (payloadKey, defaultValue) => {
  return {
    get(payload = {}) {
      return payload[payloadKey] || defaultValue;
    }
  };
};

export const getActionTarget = (payload = {}) => {
  if (payload.target) return payload.target;
  if (payload.userName) return 'user';
  if (payload.teamId) return 'team';
  return 'public';
};

export const getActionFrom = (map, getters) => {
  const getters$ = !getters ? [
    getActionTarget
  ] : getters;

  return {
    get(payload = {}) {
      const path = getters$.map((getter) => getter(payload)).join('.');
      return getObjectValueByPath(map, path);
    }
  };
};

// CONTENT

export const stripHtml = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// MEDIA

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

export const fileNameFromUrl = (url) => {
  var matches = url.match(/\/([^/?#]+)[^/]*$/);
  if (matches.length > 1) {
    return matches[1];
  }
  return null;
};
