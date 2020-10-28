<template>
  <component
    :is="attributeComponent"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeViewTypeComponent
  } from '@/components/Attributes/_mixins';

  import AttributesStepperReadDefault from '@/components/Attributes/Stepper/Read/AttributesStepperReadDefault';
  import AttributesStepperReadSmall from '@/components/Attributes/Stepper/Read/AttributesStepperReadSmall';
  import { commonProps } from '@/variables/props';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadDefault,
      AttributesStepperReadSmall
    },
    mixins: [attributeViewTypeComponent],
    props: {
      ...commonProps.attribute,
      ...commonProps.viewType
    }
  };
</script>
