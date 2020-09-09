<template>
  <v-text-field
    v-model="internalValue"
    :label="internalAttribute.title"
    hide-details="auto"
    outlined
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesTextSet',
    mixins: [commonSet]
  };
</script>
