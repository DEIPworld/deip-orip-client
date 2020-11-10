import Comparable from 'vuetify/lib/mixins/comparable';

const stabilizeJson = (obj) => JSON.parse(JSON.stringify(obj))

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
      this._compareCache = { ..._.cloneDeep(data) };
    },

    $$isChanged(data) {
      const a = _.cloneDeep(data);
      const b = this._compareCache;

      if (this._compareCache) {
        return !this.valueComparator(stabilizeJson(a), stabilizeJson(b));
      }
      return false;
    }
  }
};
