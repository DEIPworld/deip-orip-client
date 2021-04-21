import { ATTRIBUTE_SCOPE } from '@/variables';

export const attributesChore = {
  computed: {
    $$projectAttributes() {
      return this.$store.getters['Attributes/list']({ tenantId: [this.$tenant.id, null], scope: ATTRIBUTE_SCOPE.PROJECT });
    },
    $$userAttributes() {
      return this.$store.getters['Attributes/list']({ tenantId: [this.$tenant.id, null], scope: ATTRIBUTE_SCOPE.USER });
    },
    $$networkProjectAttributes() {
      return this.$store.getters['Attributes/list']({ scope: ATTRIBUTE_SCOPE.PROJECT });
    },
    $$networkAttributes() {
      return this.$store.getters['Attributes/list']();
    }
  },
  methods: {
    $$getAttributeInfo(id, attributes = this.$$networkAttributes) {
      return attributes.find((a) => a._id === id);
    }
  }
};
