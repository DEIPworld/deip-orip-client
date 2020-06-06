<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      
      <div class="headline text-center mb-3">
        Select discipline(s) your funding opportunity is related to
      </div>

      <div class="subtitle-1 mb-2 text-center">
        {{ foa.disciplines.map(discipline => discipline.label).join(' · ') }}
      </div>

      <div class="pt-2">
        <div class="overflow-y-auto discipline-picker">
          <advanced-discipline-picker style="max-height: 400px"
            :preselected="foa.disciplines"
            :without-user-disciplines="true"
            @select="selectDiscipline"
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
