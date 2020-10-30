<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$veeRules"
  >
    <v-checkbox
      v-model="internalValue"

      :label="attribute.title"

      hide-details="auto"
      :error-messages="errors"

      class="ma-0"
    />
  </validation-provider>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  import { extend } from 'vee-validate';

  extend('required', {
    validate(val) {
      return !!val;
    },
    message: '{_field_} is required'
  });

  export default {
    name: 'AttributesCheckboxSet',
    mixins: [attributeSet]
  };
</script>
