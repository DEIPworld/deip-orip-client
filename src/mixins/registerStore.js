import crc32 from 'crc/crc32';

export const componentStoreFactory = (storeModule) => ({
  data() {
    const storeModuleHash = crc32(JSON.stringify(this.$options.propsData)).toString(32);
    const storeNS = `${this.$options.name}-${storeModuleHash}`;

    return {
      storeNS
    };
  },
  created() {
    this.registerStoreModule(storeModule);
  },
  methods: {
    registerStoreModule(module) {
      if (!(this.$store && this.$store.state && this.$store.state[this.storeNS])) {
        this.$store.registerModule(this.storeNS, module);
      }
    }
  }
});

export const componentStoreFactoryOne = (storeModule, name) => ({
  created() {
    this.registerStoreModule(storeModule);
  },
  methods: {
    registerStoreModule(module) {
      if (!(this.$store && this.$store.state && this.$store.state[name])) {
        this.$store.registerModule(name, module);
      }
    }
  }
});
