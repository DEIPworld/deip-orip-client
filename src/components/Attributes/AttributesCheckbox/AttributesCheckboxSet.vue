<template>
  <v-checkbox
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
    class="ma-0"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins/set';

  export default {
    name: 'AttributesCheckboxSet',
    mixins: [attributeSet]
  };
</script>
