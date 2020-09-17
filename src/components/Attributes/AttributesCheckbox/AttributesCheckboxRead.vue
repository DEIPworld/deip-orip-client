<template>
  <div v-if="internalValue">
    {{ internalAttribute.title }}: {{ internalValue }}
  </div>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCheckboxRead',
    mixins: [commonRead]
  };
</script>
