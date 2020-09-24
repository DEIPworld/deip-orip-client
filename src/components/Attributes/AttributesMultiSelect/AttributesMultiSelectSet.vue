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
  >
    <template #selection="{ item }">
      <v-chip
        close
        close-icon="clear"
        outlined
      >
        {{ item }}
      </v-chip>
    </template>
  </d-autocomplete>
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
