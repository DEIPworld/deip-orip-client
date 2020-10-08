<template>
  <v-list v-if="attrHasData" nav class="pa-0">
    <v-radio-group
      v-model="selected"
      class="pa-0 ma-0"
      hide-details="auto"
    >
      <v-list-item
        v-for="(item, index) of attribute.value"
        :key="`lic-${index}`"
        class="mx-n2"
        link
        @click="selected = item"
      >
        <v-list-item-action class="mr-4">
          <v-radio :value="item" />
        </v-list-item-action>

        <v-list-item-content>
          {{ item.name }}
        </v-list-item-content>

        <v-list-item-action-text>
          {{ toAssetString(item.fee) }}
        </v-list-item-action-text>

      </v-list-item>
    </v-radio-group>
  </v-list>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import { assetsChore } from '@/mixins/assetsChore';

  export default {
    name: 'AttributesExpressLicensingRead',
    mixins: [attributeRead, assetsChore],
    data() {
      return {
        selected: null
      };
    }
  };
</script>
