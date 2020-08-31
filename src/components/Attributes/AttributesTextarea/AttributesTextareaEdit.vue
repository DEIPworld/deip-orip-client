<template>
  <attributes-common-edit-node v-model="internalValue" />
</template>

<script>
  import { commonEdit } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesTextareaEdit',
    mixins: [commonEdit]
  };
</script>
