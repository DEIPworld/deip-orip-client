<template>
  <v-checkbox
    v-model="internalValue"
    :label="internalAttribute.title"
    hide-details="auto"
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCheckboxSet',
    mixins: [commonSet]
  };
</script>
