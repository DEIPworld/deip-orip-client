import { hasValue } from '@/utils/helpers';
import { ATTR_TYPES } from '@/variables';

export const projectContext = {
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    $$isProjectMember() {
      return this.$isUser && this.project.members.includes(this.$currentUser.username);
    },

    $$isTenantUser() {
      return this.project.tenantId === this.$currentUser.profile.tenantId;
    }
  },
  methods: {
    $$getAttribute(id) {
      const attr = this.project.researchRef.attributes[id];

      if (!attr || !hasValue(attr.value)) return false;

      return attr;
    },

    $$ifAttribute(id) {
      return !!this.$$attributeValue(id);
    },

    $$ifAttributesByType(type) {
      const attrIds = this.$tenantSettings.researchAttributes
        .filter((attr) => attr.type === type)
        .map((attr) => attr._id);

      return attrIds.some((attrId) => this.$$ifAttribute(attrId));
    },

    $$attributeValue(id) {
      const attr = this.$$getAttribute(id);

      return attr ? attr.value : false;
    }
  }
};






// ////////////////////////////////////////////////

export const projectDetails = {
  mixins: [projectContext],

  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isMember() {
      return this.$isUser && this.project.members.includes(this.$currentUser.username);
    },

    financeVisible() {
      return !!(this.$isUser && (this.isMember || this.project.securityTokens.length));
    },

    accessAllowedByOwnership() {
      return this.project.members.includes(this.$currentUser.username);
    },

    accessAllowedByUserRole() {
      return [
        this.$isUser
      ].some((entry) => entry === true);
    },

    accessAllowedByRequest() {
      return this.project.researchRef.grantedAccess.includes(this.$currentUser.username);
    },

    accessAllowedByLicense() {
      if (!this.$$ifAttributesByType(ATTR_TYPES.EXPRESS_LICENSING)) {
        return this.project.tenantId === this.$env.TENANT;
      }

      return this.project.researchRef.expressLicenses
        .map((lic) => lic.owner)
        .includes(this.$currentUser.username);
    },

    contentAssessAllowed() {
      if (this.$isGuest) return false;

      return [
        this.accessAllowedByOwnership,
        this.accessAllowedByRequest,
        this.accessAllowedByLicense,
      ].some((entry) => entry === true);
    },

    accessContainerProps() {
      return {
        ...(!this.contentAssessAllowed ? {
          'data-access-message': 'Become available after licensing',
          class: 'limit-access'
        } : {})
      };
    },
  },
  methods: {
    getAttribute(id) {
      const attr = this.project.researchRef.attributes[id];
      if (!attr || !hasValue(attr.value)) return false;
      return attr;
    },

    ifAttribute(id) {
      const attr = this.getAttribute(id);

      return attr ? hasValue(attr.value) : false;
    },

    attributeValue(id) {
      const attr = this.project.researchRef.attributes[id];

      return attr ? attr.value : false;
    }
  }
};
