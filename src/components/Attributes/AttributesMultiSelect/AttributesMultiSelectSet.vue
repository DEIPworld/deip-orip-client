<template>
  <d-autocomplete
    v-model="internalValue"
    :label="attribute.title"
    :items="attribute.valueOptions"
    item-text="title"
    item-value="value"
    outlined
    multiple
    chips
    outlined-chips
    deletable-chips
    hide-details="auto"
  >
    <template #selection="{ item }">
      <v-chip
        outlined
        style="max-width:100%"
      >
        <div class="text-truncate">
          {{ item.title }}
        </div>
        <v-btn
          icon
          x-small
          class="mr-n2 ml-2"
          @click="remove(item.value)"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-chip>
    </template>
  </d-autocomplete>
</template>

<script>
  import { attributeSetOption } from '@/components/Attributes/mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesMultiSelectSet',
    components: { DAutocomplete },
    mixins: [attributeSetOption],
    data() {
      return {
        defaultValue: []
      };
    }
  };
</script>
