<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Select discipline(s) your funding opportunity is related to
      </div>

      <div class="subtitle-1 mb-2 text-align-center mx-auto discipline-max-width">
        {{ foa.disciplines.map(discipline => discipline.label).join(' · ') }}
      </div>

      <div class="flex-basis-0 flex overflow-y-auto">
        <div class="mx-auto discipline-max-width pt-2 full-height">
          <advanced-discipline-picker
            :preselected="foa.disciplines"
            :without-user-disciplines="true"
            @select="selectDiscipline"
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
          :disabled="isDisabled()"
          @click.native="nextStep()"
        >
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'FundingOpportunityDiscipline',

    props: {
      foa: { type: Object, required: true }
    },

    data() {
      return {
        isFormValid: false,

        required: (value) => !!value || 'This field is required'
      };
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      selectDiscipline(disciplines) {
        this.foa.disciplines = disciplines;
      },

      isDisabled() {
        return _.isEmpty(this.foa.disciplines);
      }
    }
  };
</script>

<style lang="less" scoped>
    .discipline-max-width {
        max-width: 600px;
        min-height: 25px;
    }
</style>
