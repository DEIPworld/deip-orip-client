import { store } from '@/store';
import { getObjectValueByPath } from 'vuetify/lib/util/helpers';

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

export const getActionMapKey = (payloadKey, defaultValue) => ({
  get(payload = {}) {
    return payload[payloadKey] || defaultValue;
  }
});

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
      const path = getters$.map((getter) => getter(payload))
        .join('.');
      return getObjectValueByPath(map, path);
    }
  };
};
