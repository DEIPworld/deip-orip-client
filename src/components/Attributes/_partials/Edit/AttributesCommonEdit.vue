<template>
  <div>
    <attributes-common-edit-meta v-model="internalValue" />
    <attributes-common-edit-props v-model="internalValue" />
  </div>
</template>

<script>
  import { attributeEdit } from '@/components/Attributes/mixins';
  import AttributesCommonEditProps from '@/components/Attributes/_partials/Edit/AttributesCommonEditProps';

  export default {
    name: 'AttributesCommonEdit',
    components: { AttributesCommonEditProps },
    mixins: [attributeEdit]
  };
</script>
