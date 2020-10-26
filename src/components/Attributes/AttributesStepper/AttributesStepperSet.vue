<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/mixins';

  import { attributeSet } from '@/components/Attributes/mixins/set';

  import AttributesStepperSetDefault from '@/components/Attributes/AttributesStepper/Set/AttributesStepperSetDefault';
  import AttributesStepperSetFilter from '@/components/Attributes/AttributesStepper/Set/AttributesStepperSetFilter';

  export default {
    name: 'AttributesStepperSet',
    components: {
      AttributesStepperSetDefault,
      AttributesStepperSetFilter
    },
    mixins: [attributeSet, attributeViewTypeComponent]
  };
</script>
