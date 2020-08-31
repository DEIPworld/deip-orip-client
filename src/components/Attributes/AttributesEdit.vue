<template>
  <component
    :is="componentType"
    v-model="internalValue"
  />
</template>

<script>
  import AttributesTextEdit from '@/components/Attributes/AttributesText/AttributesTextEdit';
  import AttributesTextareaEdit from '@/components/Attributes/AttributesTextarea/AttributesTextareaEdit';
  import AttributesSelectEdit from '@/components/Attributes/AttributesSelect/AttributesSelectEdit';
  import AttributesStepperEdit from '@/components/Attributes/AttributesStepper/AttributesStepperEdit';
  import { commonAttribute } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesEdit',
    components: {
      AttributesTextEdit,
      AttributesTextareaEdit,
      AttributesSelectEdit,
      AttributesStepperEdit
    },
    mixins: [commonAttribute],
    computed: {
      componentType() {
        return `attributes-${this.type}-edit`;
      }
    }
  };
</script>
