<template>
  <v-switch
    v-model="internalValue"
    :label="internalAttribute.title"
    hide-details="auto"
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSwitchSet',
    mixins: [commonSet]
  };
</script>
