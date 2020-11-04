<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';

  import AttributesStepperSetDefault from '@/components/Attributes/Stepper/Set/AttributesStepperSetDefault';
  import AttributesStepperSetFilter from '@/components/Attributes/Stepper/Set/AttributesStepperSetFilter';

  export default {
    name: 'AttributesStepperSet',
    components: {
      AttributesStepperSetDefault,
      AttributesStepperSetFilter
    },
    mixins: [Proxyable, attributeViewTypeComponent]
  };
</script>
