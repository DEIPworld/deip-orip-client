<template>
  <validation-provider
    v-slot="{ errors, validate }"
    :name="attribute.title"
    :rules="$$veeRules"
  >
    <d-wysiwyg
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
  import DWysiwyg from '@/components/Deipify/DWysiwyg/DWysiwyg';

  export default {
    name: 'AttributesTextareaSet',
    components: { DWysiwyg },
    mixins: [attributeSet],
    methods: {
      onChange(val) {
        console.log(val)
      }
    }
  };
</script>
