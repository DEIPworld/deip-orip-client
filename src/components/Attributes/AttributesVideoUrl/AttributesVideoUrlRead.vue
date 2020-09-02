<template>
  <div v-if="internalValue">
    {{ internalAttribute.title }}: {{ internalValue }}
  </div>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesVideoUrlRead',
    mixins: [commonRead]
  };
</script>
