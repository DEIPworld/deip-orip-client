<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block title="Determine the number of security token units">
      <v-col cols="12">
        <v-text-field
          v-model="amount"
          v-mask="'#####'"
          outlined
          suffix="Units"
          :hint="(securityTokenOnSaleBalance - (amount || 0)) + ' left'"
          :rules="[rules.amountToSellRules]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Select start and end dates of project fundraise">
      <v-col cols="12">
        <div>
          <datetime-picker
            ref="startDatePicker"
            label="Start date"
            :datetime="startDate"
            :available-from-now="true"
            :rules="[
              rules.required,
              rules.greaterThanNow,
              rules.startDateShouldBeSmaller
            ]"
            @input="setStartDate"
          />
        </div>

        <div>
          <datetime-picker
            label="End date"
            :datetime="endDate"
            :available-from-now="true"
            :rules="[
              rules.required,
              rules.greaterThanNow,
              rules.endDateShouldBeGreater
            ]"
            @input="setEndDate"
          />
        </div>
      </v-col>
    </d-form-block>
    <d-form-block title="Select min and max amounts">
      <v-col cols="12">
        <v-row no-gutters>
          <v-col style="margin-right: -1px;">
            <v-text-field
              v-model="formData.softCap"
              class="rounded-br-0 rounded-tr-0"
              outlined
              label="Min"
              :rules="[rules.required, deipTokenValidator, rules.softCapSmaller]"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="formData.asset"
              class="rounded-bl-0 rounded-tl-0"
              outlined
              :items="assets"
              item-text="string_symbol"
              item-value="id"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col style="margin-right: -1px;">
            <v-text-field
              v-model="formData.hardCap"
              class="rounded-br-0 rounded-tr-0"
              outlined
              label="Max"
              :rules="[rules.required, deipTokenValidator, rules.hardCapGreater]"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="formData.asset"
              disabled
              class="rounded-bl-0 rounded-tl-0"
              outlined
              :items="assets"
              item-text="string_symbol"
              item-value="id"
            />
          </v-col>
        </v-row>
      </v-col>
    </d-form-block>

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
          {{ !isPersonalGroup ? 'Create Proposal' : 'Finish' }}
        </v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { FormMixin } from '@/utils/FormMixin';
  import moment from 'moment';

  export default {
    name: 'CreateTokenSaleForm',
    components: {
      DFormBlock
    },

    mixins: [FormMixin],

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
        default: ""
      },

      securityTokenOnSaleBalance: {
        type: Number,
        default: 0
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

    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup',
        assets: 'auth/assets'
      }),

      isPersonalGroup() {
        return this.research && this.userPersonalGroup
          ? this.research.research_group_id === this.userPersonalGroup.id
          : false;
      },

      amount: {
        get() {
          return this.formData.amountToSell;
        },
        set(val) {
          this.formData.amountToSell = parseInt(val || 0);
        }
      }
    },

    data() {
      return {
        startDate: undefined,
        endDate: undefined,
        group_permlink: null,
        isFormValid: false,

        rules: {
          amountToSellRules: (v) => this.verifyAmountRange(v)
            || `Amount should be from 0 to ${this.securityTokenOnSaleBalance}`,

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

    mounted() {
      const startDate = moment()
        .add(10, 'minutes')
        .format('YYYY-MM-DD HH:mm');
      this.setStartDate(startDate);
      this.formData.asset = this.assets[0].id;
    },
    methods: {
      verifyAmountRange(value) {
        return value > 0 && value <= this.securityTokenOnSaleBalance;
      },
      getAmountNumber(value) {
        return value === '' ? 0 : parseFloat(value);
      },
      setStartDate(value) {
        this.startDate = value;
        this.formData.startDate = new Date(value);
      },
      setEndDate(value) {
        this.endDate = value;
        this.formData.endDate = new Date(value);
      }
    }
  };
</script>

<style lang="less" scoped>
.caps-max-width {
  max-width: 500px;
}
</style>
