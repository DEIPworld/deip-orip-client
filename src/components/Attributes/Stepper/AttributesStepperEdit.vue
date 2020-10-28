<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" />
    <v-divider />
    <attribute-edit-options
      v-model="internalValue.valueOptions"
      label="Levels"
      field-label-key="Level"
    >
      <template #dot="{ index }">
        <div class="white--text text-body-2 font-weight-medium">
          {{ index + 1 }}
        </div>
      </template>
    </attribute-edit-options>
  </div>
</template>

<script>
  import { AttributeEditExtendable } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesStepperEdit',
    mixins: [AttributeEditExtendable]
  };
</script>
