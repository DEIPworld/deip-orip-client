export const dataReadyMixin = {
  data() {
    return {
      $lazyReady: false
    };
  },
  computed: {
    $ready: {
      get() {
        return this.$data.$lazyReady;
      },
      set(val) {
        this.$data.$lazyReady = val;
        this.$emit('data-ready', val);
      }
    }
  },
  methods: {
    $setReady(state = true, cb) {
      this.$ready = state;

      if (cb) {
        this.$nextTick(() => { cb(); });
      }
    }
  }
};
