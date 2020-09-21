<template>
  <component
    :is="attributeViewTypeComponent"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeRead, attributeReadOption,
    attributeViewTypeComponent,
    commonAttribute
  } from '@/components/Attributes/mixins';

  import AttributesStepperReadCard from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadCard';
  import AttributesStepperReadMain from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadMain';
  import AttributesStepperReadSidebar
    from '@/components/Attributes/AttributesStepper/Read/AttributesStepperReadSidebar';

  export default {
    name: 'AttributesStepperRead',
    components: {
      AttributesStepperReadSidebar,
      AttributesStepperReadMain,
      AttributesStepperReadCard
    },
    mixins: [attributeReadOption, attributeViewTypeComponent]
  };
</script>
