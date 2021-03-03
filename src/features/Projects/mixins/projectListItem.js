import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';
import TenantBadge from '@/features/Tenant/components/Badge/TenantBadge';
import { extendAttrModules, hasValue, researchAttributesToObject } from '@/utils/helpers';
import { collectionMerge } from '@deip/toolbox';

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
      console.log(this.project)
      const allAttrs = this.$tenantSettings.researchAttributes
        .map((attr) => ({
          researchAttributeId: attr._id,
          value: attr.defaultValue
        }));

      const constructedAttrs = collectionMerge(
        allAttrs,
        this.project.researchRef.attributes,
        { key: 'researchAttributeId' }
      );


      return {
        ...this.project,
        ...{
          researchRef: {
            ...this.project.researchRef,
            attributes: researchAttributesToObject(constructedAttrs),
            created_at: this.$options.filters.dateFormat(this.project.researchRef.created_at, 'D MMM YYYY', true)
          }
        }
      };
    }
  }
};
