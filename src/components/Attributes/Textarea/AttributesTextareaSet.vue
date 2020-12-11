<template>
  <validation-provider
    v-slot="{ errors, validate }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <vex-wysiwyg
      v-model="internalValue"

      :label="$$label"

      :error-messages="errors"
      hide-details="auto"

      :disabled="!$$isEditable"

      :name="attribute.title"
      autocomplete="off"

      @input="validate"
    />
  </validation-provider>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesTextareaSet',
    mixins: [attributeSet]
  };
</script>
