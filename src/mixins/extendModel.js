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
          this.internalValue = [...val];
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
    setInitialModel() {
      this.target$ = [{ ...model }];
    },
    removeFromModel(index) {
      this.$delete(this.target$, index);
    }
  },

  watch: {
    target$(val) {
      if (!val) {
        this.setInitialModel();
      }
    }
  },

  created() {
    if (!this.target$) {
      this.setInitialModel();
    }
    if (!this.target$.length) {
      this.appendModel();
    }
  },
});
