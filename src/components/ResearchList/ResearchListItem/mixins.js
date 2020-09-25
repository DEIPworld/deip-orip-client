import ResearchListItemRenderer
  from '@/components/ResearchList/ResearchListItem/ResearchListItemRenderer';
import { researchAttributesToObject } from '@/utils/helpers';

export const researchItem = {
  components: { ResearchListItemRenderer },
  props: {
    research: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    layoutSchema() {
      return this.$tenantSettings.researchLayouts.researchCard.layout;
    },
    research$() {
      return {
        ...this.research,
        ...{
          researchRef: {
            attributes: researchAttributesToObject(this.research.researchRef.attributes)
          }
        }
      };
    }
  }
}
