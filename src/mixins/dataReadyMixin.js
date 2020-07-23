export const dataReadyMixin = {
  data() {
    return {
      $_dataReady: false
    };
  },
  computed: {
    $ready() { return this.$data.$_dataReady; },
  },
  methods: {
    $setReady(state = true) {
      this.$data.$_dataReady = state;
    }
  }
};
