<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import AttributesDisciplinesListSetDefault from './Set/AttributesDisciplinesListSetDefault';

  export default {
    name: 'AttributesDisciplinesListSet',
    components: {
      AttributesDisciplinesListSetDefault
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
