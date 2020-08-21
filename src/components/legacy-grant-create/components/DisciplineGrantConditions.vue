<template>
  <div class="legacy-column full-height">
    <div class="c-mb-4 legacy-col-grow legacy-column">
      <div class="step-title">
        Discipline supply grant
      </div>

      <div class="legacy-col-grow overflow-y-auto">
        <div class="c-mh-auto full-height discipline-conditions">
          <v-form ref="form" v-model="isFormValid" class="">
            <div class="text-subtitle-1 bold">
              Dates attended
            </div>

            <div class="legacy-row">
              <div class="legacy-col-6 c-pr-3">
                <datetime-picker
                  label="Start date"
                  :datetime="grantInfo.startDate"
                  :available-from-now="true"
                  :rules="[
                    rules.required,
                    rules.greaterThanNow,
                    rules.startDateShouldBeSmaller
                  ]"
                  @input="setDateFrom"
                />
              </div>

              <div class="legacy-col-6 c-pl-3">
                <datetime-picker
                  label="End date"
                  :datetime="grantInfo.endDate"
                  :available-from-now="true"
                  :rules="[
                    rules.required,
                    rules.greaterThanNow,
                    rules.endDateShouldBeGreater
                  ]"
                  @input="setDateTo"
                />
              </div>
            </div>

            <div class="c-pt-4 text-subtitle-1 bold">
              Description
              <span class="text-caption">(optional)</span>
            </div>

            <v-textarea
              v-model="grantInfo.description"
              outlined
              rows="2"
              auto-grow
            />
          </v-form>
        </div>
      </div>
    </div>

    <div class="legacy-row legacy-justify-center align-center">
      <v-btn text small @click.native="prevStep()">
        <v-icon dark class="pr-1">
          keyboard_arrow_left
        </v-icon> Back
      </v-btn>

      <v-btn
        color="primary"
        :disabled="!isFormValid || isLoading"
        :loading="isLoading"
        @click.native="finish()"
      >
        Create grant
      </v-btn>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'DisciplineGrantConditions',

    props: {
      grantInfo: { type: Object, required: true },
      isLoading: { type: Boolean, required: true }
    },

    data() {
      return {
        isFormValid: false,

        rules: {
          required: (value) => !!value || 'This field is required',
          greaterThanNow: (val) => Date.parse(val) > Date.now() || 'Date should be in the future',

          startDateShouldBeSmaller: (val) => !this.grantInfo.endDate
            || Date.parse(val) < Date.parse(this.grantInfo.endDate)
            || 'Start date should be smaller than end date',

          endDateShouldBeGreater: (val) => !this.grantInfo.startDate
            || Date.parse(val) > Date.parse(this.grantInfo.startDate)
            || 'End date should be greater than start date'
        }
      };
    },

    created() {
      const startDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
      this.setDateFrom(startDate);
    },

    methods: {
      finish() {
        this.$emit('finish');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setDateFrom(date) {
        this.grantInfo.startDate = date;
      },
      setDateTo(date) {
        this.grantInfo.endDate = date;
      }
    }
  };
</script>

<style lang="less" scoped>
    .discipline-conditions {
        max-width: 800px;
    }
</style>
