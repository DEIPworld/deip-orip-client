<template>
  <div v-if="attribute.value">
    {{ attributeInfo.title }}
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesSwitchRead',
    mixins: [attributeRead]
  };
</script>
