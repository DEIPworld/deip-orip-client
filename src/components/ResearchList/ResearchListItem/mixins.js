import ResearchListItemRenderer
  from '@/components/ResearchList/ResearchListItem/ResearchListItemRenderer';
import { camelizeObjectKeys, extendAttrModules, researchAttributesToObject } from '@/utils/helpers';

export const researchItem = {
  components: { ResearchListItemRenderer },
  props: {
    research: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    layoutSchemaOld() {
      return this.$tenantSettings.researchLayouts.projectListCard.layout;
    },

    layoutSchema() {
      const { layout } = this.$tenantSettings.researchLayouts.projectListCard;

      return extendAttrModules(
        layout,
        { attrs: { project: camelizeObjectKeys(this.research) } }
      );
    },

    research$() {
      return {
        ...this.research,
        ...{
          created_at: this.$options.filters.dateFormat(this.research.created_at, 'D MMM YYYY', true),
          researchRef: {
            attributes: researchAttributesToObject(this.research.researchRef.attributes)
          },
          cover: this.$options.filters.researchBackgroundSrc(this.research.external_id)
        }
      };
    }
  }
}
