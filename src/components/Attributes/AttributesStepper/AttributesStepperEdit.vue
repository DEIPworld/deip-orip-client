<template>
  <div>
    <attributes-common-edit-node v-model="internalValue" />
    <attributes-common-edit-opts
      v-model="internalValue"
      label="Levels"
      field-label-key="Level"
    >
      <template #dot="{ index }">
        <div class="white--text text-body-2 font-weight-medium">
          {{ index + 1 }}
        </div>
      </template>
    </attributes-common-edit-opts>
  </div>
</template>

<script>
  import { commonEdit } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesStepperEdit',
    mixins: [commonEdit]
  };
</script>
