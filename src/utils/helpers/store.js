import crc32 from 'crc/crc32';
import { getObjectValueByPath, wrapInArray } from 'vuetify/lib/util/helpers';
import { cloneDeep } from 'lodash';
import { store } from '@/store';

const getModuleName = (name, hashFrom, unique) => {
  const moduleHash = crc32(JSON.stringify(hashFrom))
    .toString(32);
  let moduleName = name || this.$options.name;
  if (unique) {
    moduleName += `-${moduleHash}`;
  }

  return moduleName;
};

// //////////////////////////

export function registerStoreModule(module, name, unique = false) {
  return new Promise((resolve) => {
    const moduleName = getModuleName(
      (name || this.$options.name),
      (this.$options.propsData || {}),
      unique
    );
    const clone = cloneDeep(module);
    const storeModule = clone.namespaced ? clone : {
      ...clone,
      namespaced: true
    };

    this.$store.registerModule(moduleName, storeModule);
    this.$$storeNS = moduleName;
    resolve(moduleName);

    resolve(moduleName);
  });
}

export function unregisterStoreModule(name, unique = false) {
  const moduleName = getModuleName(
    (name || this.$options.name),
    (this.$options.propsData || {}),
    unique
  );
  if (this.$store.hasModule(moduleName)) {
    this.$store.unregisterModule(moduleName);
  }
}

export const awaitStore = (getter, nestKey) => new Promise((resolve, reject) => {
  const target = nestKey ? store.getters[getter][nestKey] : store.getters[getter];

  if (target === undefined || target === false) {
    const unwatch = store.watch(
      (state, getters) => (nestKey ? getters[getter][nestKey] : getters[getter]),
      (newValue) => {
        unwatch();
        resolve(newValue);
      }
    );
  } else {
    resolve(target);
  }
});

export const getActionByPath = (actionsMap) => {
  return {
    get(path) {
      return getObjectValueByPath(actionsMap, wrapInArray(path).join('.'));
    }
  };
};
