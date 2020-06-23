<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="text-h5 text-center mb-3">
        Specify due dates
      </div>

      <v-form ref="form" v-model="isFormValid">
        <div>
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

        <div>
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

      <div class="text-center py-4">
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
    </v-col>
  </v-row>
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
