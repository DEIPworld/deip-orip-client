<template>
  <d-autocomplete
    v-model="internalValue"

    :label="attribute.title"
    :items="attribute.valueOptions"

    hide-details="auto"
    item-text="title"
    item-value="value"

    outlined

    v-bind="isMultipleProps"
  />
</template>

<script>
  import { attributeSetForceArray } from '@/components/Attributes/mixins/set';
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
