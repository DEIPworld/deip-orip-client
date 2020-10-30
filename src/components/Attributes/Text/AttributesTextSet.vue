<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$veeRules"
  >
    <v-text-field
      v-model="internalValue"
      :label="attribute.title"
      hide-details="auto"
      :error-messages="errors"
      outlined
    />
  </validation-provider>

</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesTextSet',
    mixins: [attributeSet]
  };
</script>
