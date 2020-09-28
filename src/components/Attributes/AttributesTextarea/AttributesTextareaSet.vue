<template>
  <v-textarea
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
    auto-grow
    outlined
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesTextareaSet',
    mixins: [attributeSet]
  };
</script>
