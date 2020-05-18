import { store } from '@/store';

export function loadPage(loadPagePromise, next) {
  store.dispatch('layout/setGlobalLoader');
  loadPagePromise
    .then(next)
    .finally(() => { store.dispatch('layout/hideGlobalLoader'); });
}
