<template>
  <div class="display-flex flex-column full-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Provide additional information
      </div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto guidelines-max-width">
          <v-textarea
            v-model="foa.description"
            label="Opportunity description"
            filled
            auto-grow
            rows="2"
          />

          <v-text-field
            v-model="foa.additionalInfoLink"
            filled
            label="Link to additional information"
          />

          <v-text-field
            v-model="foa.grantorEmail"
            filled
            label="Grantor contact e-mail address"
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

        <v-btn
          color="primary"
          :loading="isSending"
          :disabled="isNextDisabled() || isSending"
          @click.native="finish()"
        >
          Finish
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FundingOpportunityAdditional',

    props: {
      foa: { type: Object, required: true },
      isSending: { type: Boolean, default: false }
    },

    data() {
      return {
        rules: {
          required: (v) => !!v || 'This field is required'
        }
      };
    },

    methods: {
      finish() {
        this.$emit('finish');
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
