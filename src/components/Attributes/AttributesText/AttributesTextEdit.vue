<template>
  <div>
    <attributes-common-edit-meta v-model="internalValue" />
    <attributes-common-edit-props v-model="internalValue" />
  </div>
</template>

<script>
  import { commonEdit } from '@/components/Attributes/mixins';
  import AttributesCommonEditProps from '@/components/Attributes/AttributesCommon/AttributesCommonEditProps';

  export default {
    name: 'AttributesTextEdit',
    components: { AttributesCommonEditProps },
    mixins: [commonEdit]
  };
</script>
