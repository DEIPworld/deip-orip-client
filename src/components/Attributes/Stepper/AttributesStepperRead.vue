<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';

  import AttributesStepperReadDefault from '@/components/Attributes/Stepper/Read/AttributesStepperReadDefault';
  import AttributesStepperReadSmall from '@/components/Attributes/Stepper/Read/AttributesStepperReadSmall';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadDefault,
      AttributesStepperReadSmall
    },
    mixins: [attributeViewTypeComponent]
  };
</script>
