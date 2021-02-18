<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';


  import AttributesNetworkContentAccessReadDefault from './views/AttributesNetworkContentAccessReadDefault';
  import AttributesNetworkContentAccessReadWidget from './views/AttributesNetworkContentAccessReadWidget';

  export default {
    name: 'AttributesNetworkContentAccessRead',
    components: {
      AttributesNetworkContentAccessReadDefault,
      AttributesNetworkContentAccessReadWidget
    },
    mixins: [Proxyable, attributeViewTypeComponent]
  };
</script>
