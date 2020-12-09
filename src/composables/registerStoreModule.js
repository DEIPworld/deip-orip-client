import crc32 from 'crc/crc32';
import { cloneDeep } from 'lodash';

const getModuleName = (name, hashFrom, unique) => {
  const moduleHash = crc32(JSON.stringify(hashFrom))
    .toString(32);
  let moduleName = name || this.$options.name;
  if (unique) {
    moduleName += `-${moduleHash}`;
  }

  return moduleName;
};

export function registerStoreModule(module, name, unique = false) {
  return new Promise((resolve, reject) => {
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

    // if (!this.$store.hasModule(moduleName)) {
    this.$store.registerModule(moduleName, storeModule);
    this.$$storeNS = moduleName;
    resolve(moduleName);
    // } else {
    //   reject(new Error(`${moduleName} already in store`));
    // }

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
