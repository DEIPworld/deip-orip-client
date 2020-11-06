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
          name="Amount"
          autocomplete="off"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="assetModel.assetId"
        class="rounded-bl-0 rounded-tl-0"
        :items="assetsList"
        :hide-details="true"
        outlined
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
        assetModel: this.value
          ? {
            ...{
                amount: undefined,
                assetId: undefined
              },
            ...this.value
          } : {
            amount: undefined,
            assetId: undefined
          }
      };
    },
    computed: {
      assetsList() {
        return this.assets.map((ass) => ass.string_symbol);
      }
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
      if (!this.assetModel.assetId) {
        this.assetModel = {
          ...this.assetModel,
          ...{
            assetId: this.$env.ASSET_UNIT
          }
        };
      }
    }
  };
</script>
