<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <user-selector
      v-model="internalValue"
      :label="$$label"
      :error-messages="errors"
      :disabled="!$$isEditable"
      :multiple="attribute.isMultiple"
      :portal-id="$env.TENANT"
    />
  </validation-provider>
</template>

<script>
  import { attributeSetForceArray } from '@/components/Attributes/_mixins';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  export default {
    name: 'AttributesUserSelectSet',
    components: { UserSelector },
    mixins: [attributeSetForceArray]
  };
</script>
