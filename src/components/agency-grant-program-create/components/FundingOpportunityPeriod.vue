<template>
  <div class="display-flex flex-column full-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Specify due dates
      </div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto period-max-width pt-4">
          <v-form ref="form" v-model="isFormValid" class="layout row wrap">
            <div class="flex xs12">
              <datetime-picker
                ref="startDatePicker"
                label="Open date"
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

            <div class="flex xs12">
              <datetime-picker
                label="Close date"
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
          </v-form>
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
          :disabled="!isFormValid"
          @click.native="nextStep()"
        >
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'FundingOpportunityPeriod',

    props: {
      foa: { type: Object, required: true }
    },

    data() {
      return {
        startDate: undefined,
        endDate: undefined,

        isFormValid: false,

        rules: {
          required: (val) => !!val || 'This field is required',
          greaterThanNow: (val) => Date.parse(val) > Date.now() || 'Date should be in the future',

          startDateShouldBeSmaller: (val) => !this.endDate
            || Date.parse(val) < Date.parse(this.endDate)
            || 'Start date should be smaller than end date',

          endDateShouldBeGreater: (val) => !this.startDate
            || Date.parse(val) > Date.parse(this.startDate)
            || 'End date should be greater than start date'
        }
      };
    },

    mounted() {
      const startDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
      this.setStartDate(startDate);
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      setStartDate(value) {
        this.startDate = value;
        this.foa.startDate = new Date(value);
      },
      setEndDate(value) {
        this.endDate = value;
        this.foa.endDate = new Date(value);
      }
    }
  };
</script>

<style lang="less" scoped>
    .period-max-width {
        max-width: 300px;
    }
</style>
