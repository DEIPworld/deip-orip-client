import { hasValue } from '@/utils/helpers';

export const teamDetails = {
  props: {
    team: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
  },
  methods: {
    getAttribute(id) {
      const attr = this.user.profile.attributes[id];
      if (!attr || !hasValue(attr.value)) return false;
      return attr;
    },

    ifAttribute(id) {
      const attr = this.getAttribute(id);

      return attr ? hasValue(attr.value) : false;
    },

    attributeValue(id) {
      const attr = this.user.profile.attributes[id];

      return attr ? attr.value : false;
    }
  }
};
