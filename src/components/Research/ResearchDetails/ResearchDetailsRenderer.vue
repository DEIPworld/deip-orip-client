<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  import ContentList from '@/components/ContentsList/ContentsList';
  import ReviewsList from '@/components/ReviewsList/ReviewsList';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      AttributesRead,

      ReviewsList,
      ContentList
    },
    mixins: [componentsRenderer],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
