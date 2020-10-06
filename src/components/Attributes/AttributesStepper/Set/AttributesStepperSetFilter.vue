<template>
  <d-autocomplete
    v-model="internalValue"
    class="fix-width"
    :label="attribute.title"
    :items="attribute.valueOptions"
    item-text="title"
    item-value="value"
    hide-details="auto"
    outlined
    multiple
  >

    <template #item="{ item }">
      <v-list-item-avatar
        :size="24"
        color="primary"
        class="text-body-2 font-weight-medium white--text"
      >
        {{ getNum(item.value) }}
      </v-list-item-avatar>
      <v-list-item-content class="text-body-2">
        {{ item.title }}
      </v-list-item-content>
    </template>

    <template #selection="{ item }">
      <v-chip
        outlined
        style="max-width:100%"
      >
        <v-avatar
          left
          style="margin-left: -8px;"
          color="primary"
          class="text-body-2 font-weight-medium white--text"
        >
          {{ getNum(item.value) }}
        </v-avatar>

        <div class="text-truncate spacer">
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
  import { attributeSet } from '@/components/Attributes/mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesStepperSetFilter',
    components: {
      DAutocomplete
    },
    mixins: [attributeSet],
    data() {
      return {
        defaultValue: []
      };
    },
    methods: {
      getNum(id) {
        return this.attribute.valueOptions.findIndex(({ value }) => value === id) + 1;
      },
      remove(val) {
        const idx = this.internalValue.indexOf(val);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      }
    }
  };
</script>
