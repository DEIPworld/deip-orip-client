<template>
  <div v-if="attribute.value">
    {{ attributeInfo.title }}
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCheckboxRead',
    mixins: [attributeRead]
  };
</script>
