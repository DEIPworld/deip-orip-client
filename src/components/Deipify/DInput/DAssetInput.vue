<template>
  <v-row no-gutters>
    <v-col
      cols="auto"
      class="spacer"
      style="margin-right: -1px;"
    >
      <v-text-field
        v-model="internalValue.amount"
        class="rounded-br-0 rounded-tr-0"
        :label="label"
        outlined
        hide-details="auto"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="internalValue.assetId"
        class="rounded-bl-0 rounded-tl-0"

        outlined
        :items="assets"
        item-text="string_symbol"
        item-value="id"
        hide-details="auto"
      />
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { assetsChore } from '@/mixins/chores';
  import { consoleWarn } from 'vuetify/lib/util/console';
  import { isObject } from '@/utils/helpers';

  // internalLazyValue: this.value !== undefined
  //   ? this.value
  //   : this.multiple ? [] : undefined,

  // internalLazyValue: this.value || 0,

  // /\d+[.]{1}\d+\s[a-zA-Z0-9]+/ - для цифры-точка-цифры-пробел-буквы_с_цифрами
  // /\d+[.]{1}\d+\s[a-zA-Z]+/ - для цифры-точка-цифры-пробел-только_буквы

  export default {
    name: 'DAssetInput',
    mixins: [Proxyable, assetsChore],
    props: {
      label: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        internalLazyValue: this.value
          ? this.value
          : { }
      };
    },
    created() {
      if (!isObject(this.internalValue)) {
        consoleWarn('Model must be bound to an object.', this);
      }
    }
  };
</script>
