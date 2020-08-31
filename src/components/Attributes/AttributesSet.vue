<template>
  <div>
    <component
      :is="componentType"
      v-model="internalValue"
      :attribute="attribute"
      :multiple="multiple"
    />
  </div>

</template>

<script>
  import AttributesTextSet from '@/components/Attributes/AttributesText/AttributesTextSet';
  import AttributesTextareaSet from '@/components/Attributes/AttributesTextarea/AttributesTextareaSet';
  import AttributesSelectSet from '@/components/Attributes/AttributesSelect/AttributesSelectSet';
  import AttributesStepperSet from '@/components/Attributes/AttributesStepper/AttributesStepperSet';
  import { commonAttribute, internalType } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSet',
    components: {
      AttributesTextSet,
      AttributesTextareaSet,
      AttributesSelectSet,
      AttributesStepperSet
    },
    mixins: [commonAttribute, internalType],
    computed: {
      componentType() {
        return `attributes-${this.internalType}-set`;
      }
    }
  };
</script>
