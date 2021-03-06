import { hasValue } from '@/utils/helpers';
import { ATTR_TYPES } from '@/variables';
import { attributesChore } from '@/mixins/chores/attributesChore';

export const projectContext = {
  mixins: [attributesChore],
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

    $$isPortalUser() {
      return this.$isUser && this.project.portalId === this.$currentUser.profile.portalId;
    }
  },
  methods: {
    $$getAttribute(id) {
      const attr = this.project.attributes[id];

      if (!attr || !hasValue(attr.value)) return false;

      return attr;
    },

    $$ifAttribute(id) {
      return !!this.$$attributeValue(id);
    },

    $$ifAttributesByType(type) {
      const attrIds = this.$$projectAttributes
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
      return !this.$isGuest && this.project.members.includes(this.$currentUser.username);
    },

    financeVisible() {
      return !!(this.$isUser && (this.isMember || this.project.securityTokens.length));
    },

    hasLicenseModule() {
      return this.$$ifAttributesByType(ATTR_TYPES.EXPRESS_LICENSING || 'expressLicensing');
    },

    accessAllowedByMembership() {
      return this.$isUser && this.project.members.includes(this.$currentUser.username);
    },

    accessAllowedByRequest() {
      return this.$isUser && this.project.grantedAccess
        .some((entry) => [
          this.$currentUser.username,
          ...this.$currentUser.teams.map((g) => g._id)
        ].includes(entry));
    },

    accessAllowedByLicense() {
      if (!this.hasLicenseModule) {
        return this.project.portalId === this.$env.TENANT;
      }

      return this.$isUser && this.project.expressLicenses
        .map((lic) => lic.creator)
        .includes(this.$currentUser.username);
    },

    accessAllowedByRole() {
      return (roles) => this.$isUser && this.$currentUser.profile.roles
        .some(({ role, teamId }) => roles.some((r) => this.project.portalId == teamId && r == role));
    },

    contentAssessAllowed() {
      if (this.$isGuest) return false;

      return [
        this.accessAllowedByMembership,
        // this.accessAllowedByRole(['admin'])
        this.accessAllowedByRequest,
        this.accessAllowedByLicense,
      ].some((entry) => entry === true);
    },

    accessContainerMessage() {
      // Only license options are available - Unlock the materials by purchasing a license
      // Only get access option is available - Unlock the materials by getting permission
      // Both - Unlock the materials by either purchasing a license or by getting permission

      if (this.hasLicenseModule) {
        return 'Unlock the materials either by purchasing a license or by getting permission';
      }

      return 'Unlock the materials by getting permission';
    },

    accessContainerProps() {
      return {
        ...(!this.contentAssessAllowed ? {
          'data-access-message': this.accessContainerMessage,
          class: 'limit-access'
        } : {})
      };
    },
  },
  methods: {
    getAttribute(id) {
      const attr = this.project.attributes[id];
      if (!attr || !hasValue(attr.value)) return false;
      return attr;
    },

    ifAttribute(id) {
      const attr = this.getAttribute(id);

      return attr ? hasValue(attr.value) : false;
    },

    attributeValue(id) {
      const attr = this.project.attributes[id];

      return attr ? attr.value : false;
    }
  }
};
