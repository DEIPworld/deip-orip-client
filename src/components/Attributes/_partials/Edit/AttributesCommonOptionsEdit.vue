<template>
  <div>
    <attributes-common-edit-meta v-model="internalValue" />
    <attributes-common-edit-props v-model="internalValue" />
    <v-divider />
    <attributes-common-edit-opts
      v-model="internalValue"
    />
  </div>
</template>

<script>

  import { commonEdit } from '@/components/Attributes/mixins';
  import AttributesCommonEditProps from '@/components/Attributes/_partials/Edit/AttributesCommonEditProps';

  export default {
    name: 'AttributesCommonOptionsEdit',
    components: { AttributesCommonEditProps },
    mixins: [commonEdit]
  };
</script>
