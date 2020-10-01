<template>
  <div class="legacy-column full-height">
    <div class="c-mb-4 legacy-col-grow legacy-column">
      <div class="step-title">
        Supply grant for "{{ this.grantInfo.discipline && this.grantInfo.discipline.label }}" discipline
      </div>

      <div class="legacy-col-grow overflow-y-auto">
        <div class="c-mh-auto full-height discipline-amount display-flex">
          <div class="c-mv-12 full-width">
            <v-text-field
              ref="amount"
              v-model="grantInfo.amount"
              outlined
              label="Amount, DEIP Tokens"
              :rules="[
                rules.required,
                rules.amount
              ]"
              :suffix="'of ' + deipTokenBalance + ' DEIP'"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="legacy-row legacy-justify-center align-center">
      <v-btn text small @click.native="prevStep()">
        <v-icon dark class="pr-1">
          keyboard_arrow_left
        </v-icon> Back
      </v-btn>

      <v-btn
        color="primary"
        :disabled="nextIsDisabled"
        @click.native="nextStep()"
      >
        Next
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DisciplineGrantAmount',

    props: {
      grantInfo: { type: Object, required: true },
      deipTokenBalance: { required: true, type: Number }
    },

    data() {
      return {
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          amount: (value) => {
            const formatValidationResult = this.deipTokenValidator(value);

            if (formatValidationResult !== true) {
              return formatValidationResult;
            } if (parseFloat(value) > this.deipTokenBalance) {
              return 'Amount is greater than your DEIP Token balance';
            }

            return true;
          }
        }
      };
    },

    computed: {
      nextIsDisabled() {
        return !this.grantInfo.amount || !this.$refs.amount.valid || this.grantInfo.amount.length < 3;
      }
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      }
    }
  };
</script>

<style lang="less" scoped>
    .discipline-amount {
        max-width: 500px;
    }
</style>
