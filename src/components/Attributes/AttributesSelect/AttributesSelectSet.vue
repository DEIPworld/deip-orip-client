<template>
  <v-select
    v-model="internalValue"
    :label="attribute.title"
    :items="attribute.valueOptions"
    hide-details="auto"
    item-text="title"
    item-value="value"
    outlined
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSelectSet',
    mixins: [attributeSet]
  };
</script>
