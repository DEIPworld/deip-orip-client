<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import { researchAttributes } from '@/mixins/platformAttributes';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  export default {
    name: 'ResearchListItemRenderer',
    components: {
      AttributesRead
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
