<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <d-input-date
      v-model="internalValue"
      :label="$$label"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      outlined

      :name="attribute.title"
      autocomplete="off"
    />
  </validation-provider>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';

  export default {
    name: 'AttributesDateSet',
    components: { DInputDate },
    mixins: [attributeSet],
    created() {
      if (this.internalValue) {
        this.internalValue = this.moment(this.internalValue).format('YYYY-MM-DD');
      }
    }
  };
</script>
