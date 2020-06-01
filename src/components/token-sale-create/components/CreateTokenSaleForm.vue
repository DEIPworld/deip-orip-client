<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block title="Determine the amount of research tokens for sale">
      <v-col cols="12">
        <v-text-field
          v-model="formData.amountToSell"
          filled
          :hint="ownedAmount - getAmountNumber(formData.amountToSell) + ' left'"
          mask="#####"
          :rules="[rules.amountToSellRules]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Select start and end dates of research fundraise">
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
        <v-text-field
          v-model="formData.softCap"
          filled
          label="Min"
          :rules="[rules.required, deipTokenValidator, rules.softCapSmaller]"
          suffix="USD"
        />

        <v-text-field
          v-model="formData.hardCap"
          filled
          label="Max"
          :rules="[rules.required, deipTokenValidator, rules.hardCapGreater]"
          suffix="USD"
        />
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
        >Cancel</v-btn>

        <v-btn
          type="submit"
          color="primary"
          class="ml-2"
          :loading="loading"
        >{{ !isPersonalGroup ? 'Create Proposal' : 'Finish' }}</v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { FormMixin } from '@/utils/FomMixin';
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

      ownedAmount: {
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
        userPersonalGroup: 'auth/userPersonalGroup'
      }),

      isPersonalGroup() {
        return this.research && this.userPersonalGroup
          ? this.research.research_group_id === this.userPersonalGroup.id
          : false;
      }
    },

    data() {
      return {
        startDate: undefined,
        endDate: undefined,
        group_permlink: null,
        isFormValid: false,

        rules: {
          amountToSellRules: (v) =>
            this.verifyAmountRange(v) ||
            `Amount should be from 1 to ${this.ownedAmount}`,
          required: (value) => !!value || 'This field is required',
          greaterThanNow: (val) =>
            Date.parse(val) > Date.now() || 'Date should be in the future',

          startDateShouldBeSmaller: (val) =>
            !this.formData.endDate ||
            Date.parse(val) < Date.parse(this.formData.endDate) ||
            'Start date should be smaller than end date',

          endDateShouldBeGreater: (val) =>
            !this.formData.startDate ||
            Date.parse(val) > Date.parse(this.formData.startDate) ||
            'End date should be greater than start date',
          softCapSmaller: () => {
            const isHardCapValid =
              this.deipTokenValidator(this.formData.hardCap) === true;
            const isSoftCapValid =
              this.deipTokenValidator(this.formData.softCap) === true;

            return (
              !isHardCapValid ||
              (isSoftCapValid &&
                isHardCapValid &&
                parseFloat(this.formData.hardCap) >
                  parseFloat(this.formData.softCap)) ||
              'Min amount should be smaller than max amount'
            );
          },

          hardCapGreater: () => {
            const isSoftCapValid =
              this.deipTokenValidator(this.formData.softCap) === true;
            const isHardCapValid =
              this.deipTokenValidator(this.formData.hardCap) === true;

            return (
              !isSoftCapValid ||
              (isSoftCapValid &&
                isHardCapValid &&
                parseFloat(this.formData.hardCap) >
                  parseFloat(this.formData.softCap)) ||
              'Max amount should be greater than min amount'
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
    },
    methods: {
      verifyAmountRange(value) {
        const amountNumber = this.getAmountNumber(value);
        return amountNumber > 0 && amountNumber <= this.ownedAmount;
      },
      getAmountNumber(value) {
        return value === '' ? 0 : parseInt(value);
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
