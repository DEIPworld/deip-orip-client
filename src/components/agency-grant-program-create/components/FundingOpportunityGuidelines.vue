<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="text-h5 text-center mb-3">
        Describe program guidelines
      </div>

      <div>
        <v-textarea
          v-model="foa.eligibleApplicants"
          label="Eligible applicants"
          auto-grow
          outlined dense
          rows="4"
          :rules="[rules.required]"
        />

        <v-textarea
          v-model="foa.eligibilityAdditionalInformation"
          label="Additional information on eligibility"
          auto-grow
          outlined dense
          rows="4"
          :rules="[rules.required]"
        />
      </div>

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
  export default {
    name: 'FundingOpportunityGuidelines',

    props: {
      foa: { type: Object, required: true }
    },

    data() {
      return {
        rules: {
          required: (v) => !!v || 'This field is required'
        }
      };
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      isNextDisabled() {
        return !this.foa.eligibleApplicants
          || !this.foa.eligibilityAdditionalInformation;
      }
    }
  };
</script>

<style lang="less" scoped>
    .guidelines-max-width {
        max-width: 600px;
    }
</style>
