<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import { researchAttributes } from '@/mixins/platformAttributes';

  import {
    VCardText,
    VDivider
  } from 'vuetify/lib/components';

  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DStack from '@/components/Deipify/DStack/DStack';

  import ResearchListItemTitle from '@/components/ResearchList/ResearchListItem/_partials/ResearchListItemTitle';
  import ResearchListItemAbstract from '@/components/ResearchList/ResearchListItem/_partials/ResearchListItemAbstract';
  import ResearchListItemDate from '@/components/ResearchList/ResearchListItem/_partials/ResearchListItemDate';

  import AttributesReadIterator from '@/components/Attributes/AttributesReadIterator';

  export default {
    name: 'ResearchListCardRenderer',
    components: {
      ResearchListItemTitle,
      ResearchListItemAbstract,
      ResearchListItemDate,

      AttributesReadIterator,

      DStack,
      DSimpleTooltip,
      VCardText,
      VDivider
    },
    mixins: [componentsRenderer, researchAttributes],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
