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
    <template #item="{item, attrs, parent}">
      <v-list-item-action class="mr-4">
        <v-checkbox :value="attrs.inputValue" @change="parent.$emit('select')" />
      </v-list-item-action>
      <v-list-item-content>
        <div class="text-body-2 text-truncate">{{ item.title }}</div>
      </v-list-item-content>
    </template>

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
  import { isArray } from '@/utils/helpers';
  import { arrayedModel } from '@/mixins/extendModel';

  export default {
    name: 'AttributesMultiSelectSet',
    components: { DAutocomplete },
    mixins: [attributeSetOption, arrayedModel]
  };
</script>
