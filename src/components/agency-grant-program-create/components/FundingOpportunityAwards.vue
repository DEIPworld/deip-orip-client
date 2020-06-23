<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="text-h5 text-center mb-3">
        Funding amount
      </div>

      <v-form v-model="isFormValid">
        <v-text-field
          v-model="foa.totalProgramFunding"
          label="Estimated total program funding"
          filled
          mask="##############"
          suffix="NGT"
          :rules="[ rules.required, rules.totalProgrammingFundingValidator ]"
        />

        <v-text-field
          v-model.number="foa.numberOfAwards"
          label="Expected number of awards"
          filled
          mask="##############"
          :rules="[ rules.required ]"
        />

        <v-text-field
          v-model="foa.awardCeiling"
          label="Award ceiling"
          filled
          mask="##############"
          suffix="NGT"
          :rules="[ rules.required, rules.awardCeilingValidator ]"
        />

        <v-text-field
          v-model="foa.awardFloor"
          label="Award floor"
          mask="##############"
          filled
          suffix="NGT"
          :rules="[ rules.required, rules.awardFloorValidator ]"
        />
      </v-form>

      <div class="text-center py-4">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon> Back
        </v-btn>
        <v-btn color="primary" :disabled="isNextDisabled()" @click.native="nextStep()">
          Next
        </v-btn>
      </div>

    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { AssetsService } from '@deip/assets-service';

  const assetsService = AssetsService.getInstance();

  const GRANT_TOKEN_SYMBOL = 'NGT';

  export default {
    name: 'FundingOpportunityAwards',

    props: {
      foa: { type: Object, required: true }
    },

    data() {
      return {
        isFormValid: false,

        rules: {
          required: (v) => !!v || 'This field is required',

          totalProgrammingFundingValidator: () => {
            const totalProgramFunding = parseInt(this.foa.totalProgramFunding);
            const awardFloor = parseInt(this.foa.awardFloor);
            const awardCeiling = parseInt(this.foa.awardCeiling);

            if (!totalProgramFunding) {
              return true;
            }

            if (!this.userBalances[GRANT_TOKEN_SYMBOL]) {
              return `No ${GRANT_TOKEN_SYMBOL} balance found for the current user`;
            }

            if (totalProgramFunding > this.fromAssetsToFloat(this.userBalances[GRANT_TOKEN_SYMBOL])) {
              return 'Balance is insufficient';
            }

            if (awardFloor && awardFloor > totalProgramFunding) {
              return 'Total program funding should be greater than award floor';
            }

            if (awardCeiling && awardCeiling > totalProgramFunding) {
              return 'Total program funding should be greater than award ceiling';
            }

            return true;
          },

          awardFloorValidator: () => {
            const totalProgramFunding = parseInt(this.foa.totalProgramFunding);
            const awardFloor = parseInt(this.foa.awardFloor);
            const awardCeiling = parseInt(this.foa.awardCeiling);

            if (!awardFloor) {
              return true;
            }

            if (totalProgramFunding && awardFloor > totalProgramFunding) {
              return 'Award floor should be smaller than total program funding';
            }

            if (awardCeiling && awardFloor > awardCeiling) {
              return 'Award floor should be smaller than award ceiling';
            }

            return true;
          },

          awardCeilingValidator: () => {
            const totalProgramFunding = parseInt(this.foa.totalProgramFunding);
            const awardFloor = parseInt(this.foa.awardFloor);
            const awardCeiling = parseInt(this.foa.awardCeiling);

            if (!awardCeiling) {
              return true;
            }

            if (awardFloor && awardCeiling < awardFloor) {
              return 'Award ceiling should be greater than award floor';
            }

            if (totalProgramFunding && awardCeiling > totalProgramFunding) {
              return 'Award ceiling should be smaller than total program funding';
            }

            return true;
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        userBalances: 'auth/userBalances'
      })
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      isNextDisabled() {
        return !this.isFormValid;
      }
    }
  };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
