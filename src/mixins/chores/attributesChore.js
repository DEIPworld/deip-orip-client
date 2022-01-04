import { ATTR_SCOPES } from '@/variables';

export const attributesChore = {
  computed: {
    $$projectAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.PROJECT });
    },
    $$userAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.USER });
    },
    $$teamAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.TEAM });
    },
    $$networkProjectAttributes() {
      return this.$store.getters['Attributes/list']({ scope: ATTR_SCOPES.PROJECT });
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
