<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" can-be-multiple />
  </div>
</template>

<script>
  import { AttributeEditBase } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesUserEdit',
    mixins: [AttributeEditBase]
  };
</script>
