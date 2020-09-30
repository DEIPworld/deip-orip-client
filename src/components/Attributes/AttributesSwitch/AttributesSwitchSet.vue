<template>
  <v-switch
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesSwitchSet',
    mixins: [attributeSet]
  };
</script>
