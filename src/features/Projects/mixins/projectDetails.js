import { hasValue } from '@/utils/helpers';
import { ATTR_TYPES } from '@/variables';

export const projectDetails = {
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isMember() {
      return this.project.members.includes(this.$currentUserName);
    },

    limitedAccess() {
      const expressLicensingId = this.$tenantSettings.researchAttributes
        .find((attr) => attr.type === ATTR_TYPES.EXPRESS_LICENSING)
        ._id;
      const hasExpressLicensing = this.ifAttribute(expressLicensingId);

      if (!hasExpressLicensing) {
        return false;
      }

      const owners = this.project.researchRef.expressLicenses.map((lic) => lic.owner);

      return ![...this.project.members, ...owners].includes(this.$currentUserName);
    }
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
