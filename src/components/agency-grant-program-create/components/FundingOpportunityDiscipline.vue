<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="text-h5 text-center mb-3">
        Select domain(s) your funding opportunity is related to
      </div>

      <div class="text-subtitle-1 mb-2 text-center">
        {{ foa.domains.map(domain => domain.label).join(' · ') }}
      </div>

      <div class="pt-2">
        <div class="overflow-y-auto domain-picker">
          <advanced-domain-picker
            style="max-height: 400px"
            :preselected="foa.domains"
            :without-user-domains="true"
            @select="selectDomain"
          />
        </div>
      </div>

      <div class="py-4 text-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon> Back
        </v-btn>

        <v-btn
          color="primary"
          :disabled="isDisabled()"
          @click.native="nextStep()"
        >
          Next
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'FundingOpportunityDomain',

    props: {
      foa: { type: Object, required: true }
    },

    data() {
      return {
        isFormValid: false,

        required: (value) => !!value || this.$t('defaultNaming.fieldRules.required')
      };
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      selectDomain(domains) {
        this.foa.domains = domains;
      },

      isDisabled() {
        return _.isEmpty(this.foa.domains);
      }
    }
  };
</script>

<style lang="less" scoped>
    .domain-max-width {
        max-width: 600px;
        min-height: 25px;
    }
</style>
