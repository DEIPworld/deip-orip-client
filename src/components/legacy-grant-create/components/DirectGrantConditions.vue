<template>
  <div class="legacy-column full-height">
    <div class="c-mb-4 legacy-col-grow legacy-column">
      <div class="step-title">
        Direct grants distribution
      </div>
      <div class="text-h6 bold c-mb-2 text-align-center">
        Please type special conditions
      </div>

      <div class="text-caption c-mb-4 text-align-center grey--text">
        You can grant your expertise tokens that match researcher's disciplines
      </div>

      <div class="legacy-col-grow overflow-y-auto">
        <div class="c-mh-auto full-height discipline-conditions">
          <div class="c-pt-6">
            <div class="legacy-row">
              <div class="legacy-col-6 c-pr-3">
                <datetime-picker
                  label="From"
                  :datetime="grantInfo.startDate"
                  @input="setDateFrom"
                />
              </div>

              <div class="legacy-col-6 c-pl-3">
                <datetime-picker
                  label="To"
                  :datetime="grantInfo.endDate"
                  @input="setDateTo"
                />
              </div>
            </div>

            <div class="legacy-row">
              <div class="legacy-col-12">
                <div class="c-pt-4 text-subtitle-1 bold">
                  Description
                  <span class="text-caption">(optional)</span>
                </div>

                <v-textarea
                  v-model="grantInfo.description"
                  rows="3"
                  outlined dense
                  auto-grow
                  label="You can mention some important features"
                />
              </div>
            </div>
          </div>
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
        :disabled="!grantInfo.startDate || !grantInfo.endDate || isLoading"
        :loading="isLoading"
        @click.native="finish()"
      >
        Create grant
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DirectGrantConditions',

    props: {
      grantInfo: { type: Object, required: true },
      isLoading: { type: Boolean, required: true }
    },

    data() {
      return {};
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
