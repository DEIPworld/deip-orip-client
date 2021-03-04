export const attributesChore = {
  computed: {
    $$tenantAttributes() {
      return this.$tenantSettings.researchAttributes;
    }
  },
  methods: {
    $$getAttributeInfo(id, attributes = this.$$tenantAttributes) {
      return attributes.find((a) => a._id === id);
    }
  }
};
