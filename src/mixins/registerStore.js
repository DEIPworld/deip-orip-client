import crc32 from 'crc/crc32';
import dotProp from 'dot-prop';

export const registerStore = {
  methods: {
    registerStoreModule(module, name) {
      if (!(this.$store && this.$store.state && this.$store.state[name])) {
        this.$store.registerModule(name, module);
      }
    }
  }
};

export const componentStoreFactory = (storeModule, hashFromProp) => ({
  mixins: [registerStore],
  data() {
    const hashProp = !hashFromProp
      ? (this.$options.propsData || {})
      : dotProp(this, hashFromProp, this.$options.propsData);

    const storeModuleHash = crc32(JSON.stringify(hashProp)).toString(32);

    return {
      storeNS: `${this.$options.name}-${storeModuleHash}`
    };
  },
  created() {
    this.registerStoreModule(storeModule, this.storeNS);
  }
});

export const componentStoreFactoryOnce = (storeModule, name) => ({
  mixins: [registerStore],
  created() {
    this.registerStoreModule(storeModule, name || this.$options.name);
  }
});
