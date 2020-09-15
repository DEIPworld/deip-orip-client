import { ATTR_AREAS } from '@/variables';

export const tenantAttributes = {
  computed: {
    tenantAttributes() {
      return this.$tenantSettings.researchAttributes;
    }
  },
  methods: {
    getAttributeInfo(id) {
      return this.tenantAttributes.find((a) => a._id === id);
    }
  }
};

export const researchAttributes = {
  mixins: [tenantAttributes],
  computed: {
    attributesByArea() {
      const attrs = this.$tenantSettings.researchAttributesAreas;

      return Object.keys(attrs).reduce((obj, area) => ({
        ...obj,
        ...{
          [area]: attrs[area].map(
            (id) => this.research.researchRef.attributes.find(
              (attr) => attr.researchAttributeId === id
            )
          )
        }
      }), {});
    }
  },
};
