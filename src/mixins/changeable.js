import Comparable from 'vuetify/lib/mixins/comparable';

export const changeable = {
  name: 'comparable',
  mixins: [Comparable],
  data() {
    return {
      _compareCache: undefined
    };
  },
  methods: {
    $$storeCache(data) {
      this._compareCache = _.cloneDeep(data);
    },
    $$isChanged(data) {
      return !this.valueComparator(_.cloneDeep(data), this._compareCache);
    }
  }
};
