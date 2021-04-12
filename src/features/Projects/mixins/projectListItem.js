import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';
import TenantBadge from '@/features/Tenant/components/Badge/TenantBadge';
import { extendAttrModules, hasValue, tenantAttributesToObject } from '@/utils/helpers';
import { collectionMerge } from '@deip/toolbox';
import { attributesChore } from '@/mixins/chores/attributesChore';

export const ProjectListItemRenderer = {
  name: 'ProjectListItemRenderer',
  components: {
    AttributesRead,

    TenantBadge
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
  mixins: [attributesChore],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    layoutSchema() {
      const { layout } = this.$tenantSettings.layouts[this.layoutKey];

      return extendAttrModules(
        layout,
        { attrs: { project: this.project } }
      );
    },

    $$projectExtended() {
      const allAttrs = this.$$projectAttributes
        .map((attr) => ({
          attributeId: attr._id,
          value: attr.defaultValue
        }));

      const constructedAttrs = collectionMerge(
        allAttrs,
        this.project.researchRef.attributes,
        { key: 'attributeId' }
      );


      return {
        ...this.project,
        ...{
          researchRef: {
            ...this.project.researchRef,
            attributes: tenantAttributesToObject(constructedAttrs),
            created_at: this.$options.filters.dateFormat(this.project.researchRef.created_at, 'D MMM YYYY', true)
          }
        }
      };
    }
  }
};
