<template>
  <d-autocomplete
    v-model="internalValue"
    :label="attribute.title"
    :items="attribute.valueOptions"
    item-text="title"
    item-value="researchAttributeId"
    outlined
    multiple
    chips
    outlined-chips
    deletable-chips
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesMultiSelectSet',
    components: { DAutocomplete },
    mixins: [attributeSet]
  };
</script>
