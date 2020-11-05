<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';

  import AttributesExpressLicensingSetDefault from './views/AttributesExpressLicensingSetDefault';
  import AttributesExpressLicensingSetFilter from './views/AttributesExpressLicensingSetFilter';

  export default {
    name: 'AttributesExpressLicensingSet',
    components: {
      AttributesExpressLicensingSetDefault,
      AttributesExpressLicensingSetFilter
    },
    mixins: [Proxyable, attributeViewTypeComponent]
  };
</script>
