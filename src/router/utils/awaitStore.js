import { store } from '@/store';

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
