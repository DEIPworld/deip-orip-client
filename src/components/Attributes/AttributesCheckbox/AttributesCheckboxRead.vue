<template>
  <div v-if="attribute.value">
    {{ attributeInfo.title }}
<!--    {{ attributeInfo._id }}-->
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCheckboxRead',
    mixins: [attributeRead]
  };
</script>
