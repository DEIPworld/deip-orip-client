<template>
  <v-select
    v-model="internalValue[internalAttribute._id]"
    :label="internalAttribute.title"
    :items="internalAttribute.valueOptions"
    item-text="title"
    item-value="value"
    outlined
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSelectSet',
    mixins: [commonSet]
  };
</script>
