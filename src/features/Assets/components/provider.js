export default {
  name: 'assetsProvider',
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    assets() { return this.$store.getters['Assets/list'](); }
  },
  render(h) {
    const slots = [];

    if (this.$scopedSlots.default) {
      slots.push(
        this.$scopedSlots.default({
          assets: this.assets
        })
      );
    }

    return h(this.tag, {}, slots);
  }
};
