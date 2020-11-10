import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';
import { extendAttrModules, hasValue, researchAttributesToObject } from '@/utils/helpers';

export const ProjectListItemRenderer = {
  name: 'ProjectListItemRenderer',
  components: {
    AttributesRead
  },
  mixins: [componentsRenderer],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    research() { return this.project; } // temp
  },
  methods: {
    ifAttribute(id) {
      const attr = this.research.researchRef.attributes[id];

      if (!attr || !attr.value) return false;

      return hasValue(attr.value);
    }
  }
};

export const projectListItem = {
  components: {
    ProjectListItemRenderer
  },
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    layoutSchema() {
      const { layout } = this.$tenantSettings.researchLayouts[this.layoutKey];

      return extendAttrModules(
        layout,
        { attrs: { project: this.project } }
      );
    },

    $$projectExtended() {
      return {
        ...this.project,
        ...{
          createdAt: this.$options.filters.dateFormat(this.project.createdAt, 'D MMM YYYY', true),
          researchRef: {
            attributes: researchAttributesToObject(this.project.researchRef.attributes)
          }
        }
      };
    }
  }
};
