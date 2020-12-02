<template>
  <v-form ref="form" @submit="onSubmit">
    <d-stack>
      <d-block title="Determine the number of security token units" compact>
        <v-row>
          <v-col cols="6">
            <validation-provider
              v-slot="{ errors }"
              name="Units"
              :rules="{
                required: true,
                unitsRange: rules.amountToSellRules(amountToSell)
              }"
            >
              <v-text-field
                v-model="amountToSell"
                v-mask="'#####'"
                outlined
                persistent-hint
                :error-messages="errors"
                :hint="amountToSellHint"
                :suffix="amountToSellSuffix"
              >
                <template #message="{ message }">
                  <div v-html="message" />
                </template>
              </v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
      </d-block>

      <d-block title="Select start and end dates of project fundraise" compact>
        <v-row>
          <v-col cols="6">
            <d-date-time-input v-model="formData.startDate" only-future label="Start date" />
          </v-col>

          <v-col cols="6">
            <d-date-time-input v-model="formData.endDate" only-future label="End date" />
          </v-col>
        </v-row>
      </d-block>
      <d-block title="Select min and max amounts" compact>
        <v-row class="d-flex">
          <v-col cols="6" class="flex-grow-1">
            <d-asset-input
              v-model="softCap"
              required
              label="Min"
            />
          </v-col>
          <v-col cols="6">
            <d-asset-input
              v-model="formData.hardCap"
              label="Max"
              required
              disable-assets
            />
          </v-col>
        </v-row>
      </d-block>

      <div v-if="!hideButtons" class="text-right">
        <slot name="buttons">
          <v-btn
            type="button"
            text
            color="primary"
            :disabled="disabled"
            @click="$router.back()"
          >
            Cancel
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            class="ml-2"
            :loading="loading"
          >
            {{ !isPersonalGroup ? 'Start' : 'Finish' }}
          </v-btn>
        </slot>
      </div>
    </d-stack>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { FormMixin } from '@/utils/FormMixin';
  import moment from 'moment';
  import { assetsChore } from '@/mixins/chores';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import { VeeFieldValidatable } from '@/mixins/veeFieldValidatable';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';
  import { extend } from 'vee-validate';
  import { required } from 'vee-validate/dist/rules';

  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  });

  extend('unitsRange', {
    params: ['message'],
    validate(units, { message }) {
      return message;
    }
  });

  const MIN_TOKEN_UNITS_TO_SELL = 100;

  export default {
    name: 'CreateTokenSaleForm',
    components: {
      DAssetInput,
      DBlock,
      DStack,
      DDateTimeInput
    },

    mixins: [FormMixin, assetsChore, VeeFieldValidatable],

    model: {
      prop: 'formData'
    },

    props: {

      formData: {
        type: Object,
        required: true
      },

      securityTokenOnSale: {
        type: String,
        default: ''
      },

      securityTokenOnSaleBalance: {
        type: Object,
        required: true
      },

      hideButtons: {
        type: Boolean,
        default: false
      },

      partialDisabled: {
        type: Object,
        default: () => ({})
      },

      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        group_permlink: null,
        isFormValid: false,
        MIN_TOKEN_UNITS_TO_SELL,

        rules: {
          // temp rules
          amountToSellRules: (v) => ({
            message: this.verifyAmountRange(v)
              || `Amount should be from ${MIN_TOKEN_UNITS_TO_SELL} to ${this.availableBalance.amount}`
          }),

          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          greaterThanNow: (val) => Date.parse(val) > Date.now() || 'Date should be in the future',

          startDateShouldBeSmaller: (val) => !this.formData.endDate
            || Date.parse(val) < Date.parse(this.formData.endDate)
            || this.$t('defaultNaming.fieldRules.startDate'),

          endDateShouldBeGreater: (val) => !this.formData.startDate
            || Date.parse(val) > Date.parse(this.formData.startDate)
            || this.$t('defaultNaming.fieldRules.endDate'),
          softCapSmaller: () => {
            const isHardCapValid = this.deipTokenValidator(this.formData.hardCap) === true;
            const isSoftCapValid = this.deipTokenValidator(this.formData.softCap) === true;

            return (
              !isHardCapValid
              || (isSoftCapValid
                && isHardCapValid
                && parseFloat(this.formData.hardCap)
                  > parseFloat(this.formData.softCap))
              || 'Min amount should be smaller than max amount'
            );
          },

          hardCapGreater: () => {
            const isSoftCapValid = this.deipTokenValidator(this.formData.softCap) === true;
            const isHardCapValid = this.deipTokenValidator(this.formData.hardCap) === true;

            return (
              !isSoftCapValid
              || (isSoftCapValid
                && isHardCapValid
                && parseFloat(this.formData.hardCap)
                  > parseFloat(this.formData.softCap))
              || 'Max amount should be greater than min amount'
            );
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup'
      }),

      softCap: {
        get() {
          return this.formData.softCap;
        },
        set(val) {
          this.formData.hardCap = {
            amount: this.formData.hardCap.amount,
            assetId: this.formData.softCap.assetId
          };
          this.formData.softCap = val;
        }
      },

      isPersonalGroup() {
        return this.research && this.userPersonalGroup
          ? this.research.research_group_id === this.userPersonalGroup.id
          : false;
      },

      availableBalance() {
        if (this.securityTokenOnSaleBalance && this.securityTokenOnSaleBalance.amount) {
          return this.$$fromAssetUnits(this.securityTokenOnSaleBalance.amount);
        }
        return null;
      },

      amountToSell: {
        get() {
          return this.formData.amountToSell;
        },
        set(val) {
          const { assetId, precision } = this.availableBalance;
          const amountToSell = this.$$toAssetUnits(val || '0', false, { symbol: assetId, fractionCount: 0 });
          this.formData.amountToSell = amountToSell;
        }
      },

      amountToSellHint() {
        if (!this.amountToSell || !this.availableBalance) return '';
        const { amount: availableAmount } = this.availableBalance;
        const { amount: sellingAmount } = this.$$fromAssetUnits(this.amountToSell);
        const { max_supply } = this.$$assetInfo(this.availableBalance.assetId);
        const maxSupplyAsset = this.$$toAssetUnits({
          amount: `${max_supply}`,
          assetId: this.availableBalance.assetId
        })
        const issuedTokens = sellingAmount / max_supply * 100;
        const teamsTokens = sellingAmount / availableAmount * 100;
        let hint = `<div class="text-body-2 text--primary">${issuedTokens.toFixed(2)}% of ${maxSupplyAsset} issued tokens</div>`;
        if (max_supply !== availableAmount) {
          hint = `${hint}<div class="text-body-2 text--primary">${teamsTokens.toFixed(2)}% of ${this.$$toAssetUnits(this.availableBalance)} team's tokens</div>`;
        }
        return hint;
      },

      amountToSellSuffix() {
        if (!this.availableBalance) return '';
        const { assetId } = this.availableBalance;
        return assetId;
      }
    },

    created() {
      const rounded = Math.round(moment().minute() / 5) * 5;
      this.formData.startDate = moment().minute(rounded).add(10, 'minutes').format('YYYY-MM-DDTHH:mm');
    },
    methods: {
      verifyAmountRange(value) {
        if (!value) return true;
        if (!this.availableBalance) return true;
        const { amount } = this.availableBalance;
        const valAmount = this.$$fromAssetUnits(value).amount;
        return valAmount >= MIN_TOKEN_UNITS_TO_SELL && valAmount <= amount;
      }
    }
  };
</script>

<style lang="less" scoped>
.caps-max-width {
  max-width: 500px;
}
</style>
