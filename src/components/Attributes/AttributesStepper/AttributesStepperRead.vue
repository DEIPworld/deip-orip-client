<template>
  <component
    :is="attributeComponent"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeReadOption,
    attributeViewTypeComponent
  } from '@/components/Attributes/mixins';

  import AttributesStepperReadDefault from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadDefault';
  import AttributesStepperReadSmall from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadSmall';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadDefault,
      AttributesStepperReadSmall
    },
    mixins: [attributeReadOption, attributeViewTypeComponent]
  };
</script>
