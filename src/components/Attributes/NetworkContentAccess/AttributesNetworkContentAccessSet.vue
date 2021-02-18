<template>
  <input type="hidden" v-model="internalValue" />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesNetworkContentAccessSet',
    mixins: [attributeSet]
  };
</script>
