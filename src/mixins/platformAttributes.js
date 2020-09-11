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
    // filledAttributes() {
    //   return this.$where(
    //     this.research.researchRef.attributes,
    //     { value: (v) => !!v }
    //   );
    // },

    attributesByArea() {
      return {
        header: this.getAttrsByArea(ATTR_AREAS.HEADER),
        main: this.getAttrsByArea(ATTR_AREAS.MAIN),
        sidebar: this.getAttrsByArea(ATTR_AREAS.SIDEBAR),
        card: this.getAttrsByArea(ATTR_AREAS.CARD)
      };
    }
  },

  methods: {
    getAttrsByArea(area) {
      return this.$where(
        this.research.researchRef.attributes,
        (attr) => attr.value
            && this.$where(
              this.tenantAttributes,
              {
                _id: attr.researchAttributeId,
                '+areas': area
              }
            ).length
      );
    }
  }
};
