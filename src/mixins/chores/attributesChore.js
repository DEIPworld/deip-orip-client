import { ATTRIBUTE_SCOPE } from '@/variables';

export const attributesChore = {
  computed: {
    $$projectAttributes() {
      return this.$store.getters['Attributes/list']({ tenantId: [this.$tenant.id, null], scope: ATTRIBUTE_SCOPE.PROJECT });
    },
    $$networkProjectAttributes() {
      return this.$store.getters['Attributes/list']();
    }
  },
  methods: {
    $$getAttributeInfo(id, attributes = this.$$networkProjectAttributes) {
      return attributes.find((a) => a._id === id);
    }
  }
};
