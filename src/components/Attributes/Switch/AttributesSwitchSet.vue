<template>
  <v-switch
    v-model="internalValue"
    :label="attribute.title"
    hide-details="auto"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesSwitchSet',
    mixins: [attributeSet],
    data() {
      return {
        defaultValue: false
      };
    }
  };
</script>
