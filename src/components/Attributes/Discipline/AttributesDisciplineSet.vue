<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesDomainSetDefault from './Set/AttributesDisciplineSetDefault';

  export default {
    name: 'AttributesDomainSet',
    components: {
      AttributesDomainSetDefault
    },
    mixins: [attributeViewTypeComponent, Proxyable],
    watch: {
      internalValue(val) {
        if (!val) {
          this.internalValue = [];
        }
      }
    }
  };
</script>
