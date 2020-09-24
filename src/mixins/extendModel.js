import Proxyable from 'vuetify/lib/mixins/proxyable';

export const arrayModelAddFactory = (model, target) => ({
  mixins: [Proxyable],

  computed: {
    target$: {
      get() { return target ? this.internalValue[target] : this.internalValue; },
      set(val) {
        if (target) {
          this.internalValue[target] = val;
        } else {
          this.internalValue = val
        }
      }
    }
  },

  methods: {
    appendModel() {
      this.target$.push(
        { ...model }
      );
    },
    removeFromModel(index) {
      this.$delete(this.target$, index);
    }
  },

  // watch: {
  //   value: {
  //     deep: true,
  //     handler(val) {
  //       this.internalLazyValue = val;
  //     }
  //   }
  // },

  created() {
    if (!this.target$) {
      this.target$ = [{ ...model }];
    }
    if (!this.target$.length) {
      this.appendModel();
    }
  },
});
