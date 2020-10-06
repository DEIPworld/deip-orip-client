<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesSet from '@/components/Attributes/AttributesSet';

  import ContentsList from '@/components/ContentsList/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';

  export default {
    name: 'ResearchEditRenderer',
    components: {
      AttributesSet,

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
