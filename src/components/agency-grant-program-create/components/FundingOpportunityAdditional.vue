<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="text-h5 text-center mb-3">
        Provide additional information
      </div>

      <div>
        <v-textarea
          v-model="foa.description"
          label="Opportunity description"
          outlined
          auto-grow
          rows="4"
        />

        <v-text-field
          v-model="foa.additionalInfoLink"
          outlined
          label="Link to additional information"
        />

        <v-text-field
          v-model="foa.grantorEmail"
          outlined
          label="Grantor contact e-mail address"
        />
      </div>

      <div class="text-center py-4">
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
    </v-col>
  </v-row>
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
