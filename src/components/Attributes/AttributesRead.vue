<template>
  <component
    :is="componentType"
    v-model="internalValue"
    :attribute="attribute"
    :small="small"
  />
</template>

<script>
  import AttributesTextRead from '@/components/Attributes/AttributesText/AttributesTextRead';
  import AttributesTextareaRead from '@/components/Attributes/AttributesTextarea/AttributesTextareaRead';
  import AttributesSelectRead from '@/components/Attributes/AttributesSelect/AttributesSelectRead';
  import AttributesStepperRead from '@/components/Attributes/AttributesStepper/AttributesStepperRead';
  import { commonAttribute, internalType } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesRead',
    components: {
      AttributesTextRead,
      AttributesTextareaRead,
      AttributesSelectRead,
      AttributesStepperRead
    },
    mixins: [commonAttribute, internalType],
    computed: {
      componentType() {
        return `attributes-${this.internalType}-read`;
      }
    }
  };
</script>
