<template>
  <div>
    <attributes-common-edit-node v-model="internalValue" />
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

  export default {
    name: 'AttributesSelectEdit',
    mixins: [commonEdit]
  };
</script>
