<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$veeRules"
  >
    <d-autocomplete
      v-model="internalValue"

      :label="$$label"
      :items="attribute.valueOptions"

      item-text="title"
      item-value="value"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      outlined

      v-bind="isMultipleProps"
    />
  </validation-provider>
</template>

<script>
  import { attributeSetForceArray } from '@/components/Attributes/_mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesSelectSet',
    components: { DAutocomplete },
    mixins: [attributeSetForceArray],

    computed: {
      isMultipleProps() {
        return {
          multiple: this.attribute.isMultiple,
          chips: this.attribute.isMultiple,
          deletableChips: this.attribute.isMultiple
        };
      }
    }
  };
</script>
