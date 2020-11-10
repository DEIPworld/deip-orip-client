export const attributesChore = {
  computed: {
    $$tenantAttributes() {
      return this.$tenantSettings.researchAttributes;
    }
  },
  methods: {
    $$getAttributeInfo(id) {
      return this.$$tenantAttributes.find((a) => a._id === id);
    }
  }
};
