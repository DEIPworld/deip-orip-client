<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesDisciplineSetDefault from './Set/AttributesDisciplineSetDefault';

  export default {
    name: 'AttributesDisciplineSet',
    components: {
      AttributesDisciplineSetDefault
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
