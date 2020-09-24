<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesSet from '@/components/Attributes/AttributesSet';

  import ContentList from '@/components/ContentsList/ContentsList';
  import ReviewsList from '@/components/ReviewsList/ReviewsList';

  export default {
    name: 'ResearchEditRenderer',
    components: {
      AttributesSet,

      ReviewsList,
      ContentList
    },
    mixins: [componentsRenderer, Proxyable],
    props: {
      attributes: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
