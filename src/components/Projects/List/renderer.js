import { componentsRenderer } from '@/mixins/renderer';
import { researchAttributes } from '@/mixins/platformAttributes';

import AttributesRead from '@/components/Attributes/AttributesRead';
import { hasValue } from '@/utils/helpers';

export default {
  name: 'ProjectListItemRenderer',
  components: {
    AttributesRead
  },
  mixins: [componentsRenderer, researchAttributes],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    ifAttribute(id) {
      const attr = this.research.researchRef.attributes[id];

      if (!attr || !attr.value) return false;

      return hasValue(attr.value);
    }
  },
  computed: {
    research() { return this.project; } // temp
  }
};
