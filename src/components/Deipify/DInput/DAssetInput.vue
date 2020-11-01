<template>
  <v-row no-gutters>
    <v-col
      cols="auto"
      class="spacer"
      style="margin-right: -1px;"
    >
      <validation-provider
        ref="amountValidator"
        v-slot="{ errors }"
        name="Amount"
        :rules="required ? 'required|amount' : ''"
      >
        <v-text-field
          v-model="assetModel.amount"
          class="rounded-br-0 rounded-tr-0"
          :label="label"
          outlined
          hide-details="auto"
          :error-messages="errors"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="assetModel.assetId"
        class="rounded-bl-0 rounded-tl-0"
        outlined
        :items="assets"
        item-text="string_symbol"
        item-value="id"
        :hide-details="true"
      />
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { assetsChore } from '@/mixins/chores';
  import { objectedModel } from '@/mixins/extendModel';

  // in place validation while wee under v4

  import { extend, ValidationProvider } from 'vee-validate';
  import { required, integer, double } from 'vee-validate/dist/rules';

  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  });

  extend('amount', {
    validate(value) {
      return integer.validate(value) || double.validate(value);
    },
    message: '{_field_} must be valid number'
  });

  // /\d+[.]{1}\d+\s[a-zA-Z0-9]+/ - для цифры-точка-цифры-пробел-буквы_с_цифрами
  // /\d+[.]{1}\d+\s[a-zA-Z]+/ - для цифры-точка-цифры-пробел-только_буквы

  export default {
    name: 'DAssetInput',
    components: {
      ValidationProvider
    },
    mixins: [Proxyable, objectedModel, assetsChore],
    props: {
      label: {
        type: String,
        default: null
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        assetModel: {
          amount: undefined,
          assetId: undefined
        }
      };
    },
    watch: {
      assetModel: {
        deep: true,
        handler(val) {
          this.internalValue = {
            ...this.internalValue,
            ...{
              amount: parseFloat(val.amount),
              assetId: val.assetId
            }
          };
        }
      }
    },
    created() {
      if (!(this.internalValue && this.internalValue.assetId)) {
        this.internalValue.assetId = this.assets[0].id;
      }
    }
  };
</script>
