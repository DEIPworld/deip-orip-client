import { store } from '@/store';
import { getObjectValueByPath, wrapInArray } from 'vuetify/lib/util/helpers';

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
