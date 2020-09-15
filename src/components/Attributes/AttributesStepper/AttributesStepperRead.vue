<template>
  <component
    :is="attributeViewTypeComponent"
    v-model="internalValue"
    :attribute-id="attributeId"
    :view-type="viewType"
  />
</template>

<script>
  import {
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
    mixins: [commonAttribute, attributeViewTypeComponent]
  };
</script>
