<template>
  <div>
    <attributes-common-edit-meta v-model="internalValue" />
    <attributes-common-edit-props v-model="internalValue" />
    <v-divider />
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
  import { attributeEdit } from '@/components/Attributes/mixins';
  import AttributesCommonEditProps from '@/components/Attributes/_partials/Edit/AttributesCommonEditProps';

  export default {
    name: 'AttributesStepperEdit',
    components: { AttributesCommonEditProps },
    mixins: [attributeEdit]
  };
</script>
