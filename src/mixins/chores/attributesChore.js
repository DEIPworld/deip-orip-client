import { ATTR_SCOPES } from '@/variables';

export const attributesChore = {
  computed: {
    $$projectAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.PROJECT || 'project' });
    },
    $$userAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.USER || 'user' });
    },
    $$teamAttributes() {
      return this.$store.getters['Attributes/list']({ portalId: [this.$portal.id, null], scope: ATTR_SCOPES.TEAM || 'team' });
    },
    $$networkProjectAttributes() {
      return this.$store.getters['Attributes/list']({ scope: ATTR_SCOPES.PROJECT || 'project' });
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
