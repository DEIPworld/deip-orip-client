<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" can-be-multiple />
    <v-divider class="my-6" />
    <attribute-edit-options v-model="internalValue.valueOptions" />
  </div>
</template>

<script>

  import { attributeEdit } from '@/components/Attributes/_mixins/edit/attributeEdit';

  import AttributeEditProps from '@/components/Attributes/_mixins/edit/_partials/AttributeEditProps';
  import AttributeEditMeta from '@/components/Attributes/_mixins/edit/_partials/AttributeEditMeta';
  import AttributeEditOptions from '@/components/Attributes/_mixins/edit/_partials/AttributeEditOptions';

  export default {
    name: 'AttributeEditExtendable',
    components: {
      AttributeEditOptions,
      AttributeEditMeta,
      AttributeEditProps
    },
    mixins: [attributeEdit]
  };
</script>
