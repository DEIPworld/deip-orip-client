<template>
  <component
    :is="attributeComponent"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import { attributeReadOption } from '@/components/Attributes/_mixins';
  import {
    attributeViewTypeComponent
  } from '@/components/Attributes/_mixins';

  import AttributesStepperReadDefault from '@/components/Attributes/Stepper/Read/AttributesStepperReadDefault';
  import AttributesStepperReadSmall from '@/components/Attributes/Stepper/Read/AttributesStepperReadSmall';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadDefault,
      AttributesStepperReadSmall
    },
    mixins: [attributeReadOption, attributeViewTypeComponent]
  };
</script>
