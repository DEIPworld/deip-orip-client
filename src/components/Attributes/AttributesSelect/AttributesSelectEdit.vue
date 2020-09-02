<template>
  <div>
    <attributes-common-edit-meta v-model="internalValue" />
    <attributes-common-edit-props v-model="internalValue" />
    <v-divider />
    <attributes-common-edit-opts
      v-model="internalValue"
    >
      <template #dot>
        <v-icon small color="white">
          adjust
        </v-icon>
      </template>
    </attributes-common-edit-opts>
  </div>
</template>

<script>

  import { commonEdit } from '@/components/Attributes/mixins';
  import AttributesCommonEditProps from '@/components/Attributes/AttributesCommon/AttributesCommonEditProps';

  export default {
    name: 'AttributesSelectEdit',
    components: { AttributesCommonEditProps },
    mixins: [commonEdit]
  };
</script>
