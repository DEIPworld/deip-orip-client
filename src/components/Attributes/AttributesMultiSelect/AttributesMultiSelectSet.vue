<template>
  <d-autocomplete
    v-model="internalValue"
    :label="internalAttribute.title"
    :items="internalAttribute.valueOptions"
    item-text="title"
    item-value="researchAttributeId"
    outlined
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesMultiSelectSet',
    components: { DAutocomplete },
    mixins: [commonSet]
  };
</script>
