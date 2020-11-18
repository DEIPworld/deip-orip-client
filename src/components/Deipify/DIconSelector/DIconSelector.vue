<template>
  <d-autocomplete
    v-model="internalValue"
    :items="icons"
    outlined
    hide-details="auto"
    label="Icon"
  >
    <template #item="{ item }">
      <v-list-item-icon class="mr-4">
        <v-icon>{{ item.value }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="text-body-2">
        {{ item.text }}
      </v-list-item-content>
    </template>
  </d-autocomplete>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import * as mdiIcons from '@mdi/js';
  import { noCase, paramCase } from 'change-case';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'DIconSelector',
    components: { DAutocomplete },
    mixins: [Proxyable],
    computed: {
      icons() {
        return Object.keys(mdiIcons)
          .map((i) => ({
            text: _.startCase(i.replace('mdi', '')),
            value: _.kebabCase(i)
          }));
      }
    }
  };
</script>
