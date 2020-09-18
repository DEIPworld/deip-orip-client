<template>
  <div :class="viewType === 'card' ? 'text-h6' : 'text-h3'">
    {{ internalValue }}
  </div>
</template>

<script>
  import AttributesCommonRead from '@/components/Attributes/_partials/Read/AttributesCommonRead';

  export default {
    name: 'AttributesTextRead',
    mixins: [AttributesCommonRead]
  };
</script>
