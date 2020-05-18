<template>
  <div class="display-flex flex-column full-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Describe program guidelines
      </div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto guidelines-max-width">
          <v-textarea
            v-model="foa.eligibleApplicants"
            label="Eligible applicants"
            auto-grow
            rows="2"
            :rules="[rules.required]"
          />

          <v-textarea
            v-model="foa.eligibilityAdditionalInformation"
            label="Additional information on eligibility"
            auto-grow
            rows="2"
            :rules="[rules.required]"
          />
        </div>
      </div>
    </div>

    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon> Back
        </v-btn>

        <v-btn color="primary" :disabled="isNextDisabled()" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
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
