<template>
  <v-select
    v-model="internalValue"
    :label="internalAttribute.title"
    :items="internalAttribute.valueOptions"
    multiple
    hide-details="auto"
    item-text="title"
    item-value="value"
    outlined
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesMultiSelectSet',
    mixins: [commonSet]
  };
</script>
