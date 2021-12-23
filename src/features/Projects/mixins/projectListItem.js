import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';
import PortalBadge from '@/features/Tenant/components/Badge/TenantBadge';
import { extendAttrModules, hasValue, portalAttributesToObject } from '@/utils/helpers';
import { collectionMerge } from '@deip/toolbox';
import { attributesChore } from '@/mixins/chores/attributesChore';

export const ProjectListItemRenderer = {
  name: 'ProjectListItemRenderer',
  components: {
    AttributesRead,

    PortalBadge
  },
  mixins: [componentsRenderer],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // project() { return this.project; } // temp
  },
  methods: {
    ifAttribute(id) {
      const attr = this.project.attributes[id];

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
      const { layout } = this.$portalSettings.layouts[this.layoutKey];

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
        this.project.attributes,
        { key: 'attributeId' }
      );


      return {
        ...this.project,
        attributes: portalAttributesToObject(constructedAttrs),
        created_at: this.$options.filters.dateFormat(this.project.createdAt, 'D MMM YYYY', true)
      };
    }
  }
};
