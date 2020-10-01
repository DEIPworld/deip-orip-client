<template>
  <v-checkbox
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
    class="ma-0"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCheckboxSet',
    mixins: [attributeSet],
    data() {
      return {
        defaultValue: false
      };
    }
  };
</script>
