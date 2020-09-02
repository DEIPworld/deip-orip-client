<template>
  <v-text-field
    v-model="internalValue"
    :label="internalAttribute.title"
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
