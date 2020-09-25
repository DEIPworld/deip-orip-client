<template>
  <component
    :is="attributeViewTypeComponent"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeReadOption,
    attributeViewTypeComponent
  } from '@/components/Attributes/mixins';

  import AttributesStepperReadCard from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadCard';
  import AttributesStepperReadDefault from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadDefault';
  import AttributesStepperReadSidebar
    from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadSidebar';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadSidebar,
      AttributesStepperReadDefault,
      AttributesStepperReadCard
    },
    mixins: [attributeReadOption, attributeViewTypeComponent]
  };
</script>
