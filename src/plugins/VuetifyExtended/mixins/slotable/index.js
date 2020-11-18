const Slotable = {
  name: 'slotable',

  methods: {
    $$hasSlot(slotName) {
      return Boolean(this.$slots[slotName] || this.$scopedSlots[slotName]);
    }
  }
};

export default Slotable;
