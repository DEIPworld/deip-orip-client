import { store } from '@/store';

export const DataPreloadMixin = {
  data() {
    return {
      dataLoaded: false
    };
  },
  created() {
    const { $dataPreload } = this.$options;

    if ($dataPreload) {
      store.dispatch('layout/setGlobalLoader');

      $dataPreload.bind(this)()
        .finally(() => {
          this.dataLoaded = true;
          store.dispatch('layout/hideGlobalLoader');
        });
    }
  }
};
