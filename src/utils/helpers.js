import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';
import kindOf from 'kind-of';

import { getNestedValue } from 'vuetify/lib/util/helpers';

// ATTRIBUTES

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
  if (payload.type) return payload.type;
  if (payload.userName) return 'user';
  if (payload.teamId) return 'team';
  return 'public';
};

export const getActionFrom = (map, getters) => {
  const getters$ = !getters ? [
    getActionTarget,
  ] : getters;

  return {
    get(payload = {}) {
      const path = getters$.map((getter) => getter(payload)).join('.');
      return getNestedValue(map, path);
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
