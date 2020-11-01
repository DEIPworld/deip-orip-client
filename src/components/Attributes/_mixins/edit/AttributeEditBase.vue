<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" />
  </div>
</template>

<script>
  import { attributeEdit } from '@/components/Attributes/_mixins/edit/attributeEdit';

  import AttributeEditProps from '@/components/Attributes/_mixins/edit/_partials/AttributeEditProps';
  import AttributeEditMeta from '@/components/Attributes/_mixins/edit/_partials/AttributeEditMeta';

  export default {
    name: 'AttributeEditBase',
    components: {
      AttributeEditMeta,
      AttributeEditProps
    },
    mixins: [attributeEdit]
  };
</script>
