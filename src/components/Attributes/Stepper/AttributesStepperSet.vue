<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import {
    attributeViewTypeComponent,
    attributeSet
  } from '@/components/Attributes/_mixins';

  import AttributesStepperSetDefault from '@/components/Attributes/Stepper/Set/AttributesStepperSetDefault';
  import AttributesStepperSetFilter from '@/components/Attributes/Stepper/Set/AttributesStepperSetFilter';

  export default {
    name: 'AttributesStepperSet',
    components: {
      AttributesStepperSetDefault,
      AttributesStepperSetFilter
    },
    mixins: [attributeSet, attributeViewTypeComponent]
  };
</script>
