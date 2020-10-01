<template>
  <component
    :is="attributeViewTypeComponent"
    v-model="internalValue"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeSetOption,
    attributeViewTypeComponent
  } from '@/components/Attributes/mixins';

  import AttributesStepperSetDefault from '@/components/Attributes/AttributesStepper/Set/AttributesStepperSetDefault';
  import AttributesStepperSetFilter from '@/components/Attributes/AttributesStepper/Set/AttributesStepperSetFilter';

  export default {
    name: 'AttributesStepperSet',
    components: {
      AttributesStepperSetDefault,
      AttributesStepperSetFilter
    },
    mixins: [attributeSetOption, attributeViewTypeComponent]
  };
</script>
