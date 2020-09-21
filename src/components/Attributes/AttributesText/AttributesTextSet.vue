<template>
  <v-text-field
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
    outlined
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesTextSet',
    mixins: [attributeSet]
  };
</script>
