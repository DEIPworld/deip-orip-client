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
          v-model="internalValue.amount"
          class="rounded-br-0 rounded-tr-0"
          :label="label"
          outlined
          hide-details="auto"
          :error-messages="[...errors, ...errorMessages]"
          name="Amount"
          autocomplete="off"
          @change="update()"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="internalValue.assetId"
        class="rounded-bl-0 rounded-tl-0"
        :items="assetsList"
        :hide-details="true"
        :disabled="disableAssets"
        outlined
        @change="update()"
      />
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { deepEqual } from 'vuetify/lib/util/helpers';

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
      },
      disableAssets: {
        type: Boolean,
        default: false
      },
      errorMessages: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      const model = {
        amount: undefined,
        assetId: this.$env.ASSET_UNIT
      };

      return {
        ...model,

        internalLazyValue: this.value
          ? {
            ...model,
            ...this.value
          } : model
      };
    },
    computed: {
      assetsList() {
        return this.assets.map((ass) => ass.string_symbol);
      }
    },
    methods: {
      update() {
        const val = {
          ...(this.amount ? { amount: parseFloat(this.internalLazyValue.amount) } : {}),
          assetId: this.internalLazyValue.assetId
        };

        this.internalValue = {
          ...this.internalValue,
          ...val
        };
      }
    }
  };
</script>
