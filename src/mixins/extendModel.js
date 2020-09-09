import Proxyable from 'vuetify/lib/mixins/proxyable';

export const arrayModelAddFactory = (model, target) => ({
  mixins: [Proxyable],

  computed: {
    target$() {
      return target ? this.internalValue[target] : this.internalValue;
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

  mounted() {
    if (!this.target$.length) {
      this.appendModel();
    }
  }
});
