<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesSet from '@/components/Attributes/AttributesSet';

  import ContentsList from '@/components/ContentsList/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';
  import ReviewsList from '@/components/ReviewsList/ReviewsList';

  export default {
    name: 'ResearchEditRenderer',
    components: {
      AttributesSet,

      ReviewsList,
      ContentsList,
      DraftsList
    },
    mixins: [componentsRenderer, Proxyable],
    props: {
      attributes: {
        type: Object,
        default: () => ({})
      }
    },
    // created() {
    //   console.log(this.attributes)
    // }
  };
</script>
