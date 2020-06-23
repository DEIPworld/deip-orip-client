<template>
  <v-row no-gutters justify="center">
    <v-col cols="7">
      <div class="text-h5 text-center mb-3">
        Roadmap
      </div>

      <div class="text-subtitle-1 text-center">
        Let’s create a roadmap for your research. Well-presented and
        detailed roadmap attracts more investors to help you to get the funding
      </div>

      <div class="pt-4">
        <milestone-stepper style="width: 100%" :is-read-only="false" :steps="research.milestones" />
      </div>

      <div class="text-center py-4">
        <v-btn text @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>
        <v-btn
          :loading="isLoading"
          :disabled="nextDisabled || isLoading"
          color="primary"
          @click.native="nextStep()"
        >
          Next step
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import moment from 'moment';
  import Vue from 'vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'CreateResearchRoadmap',
    props: {
      research: {
        type: Object,
        required: true
      },
      isLoading: {
        type: Boolean,
        required: false
      }
    },
    data() {
      return {};
    },
    computed: {
      nextDisabled() {
        return this.research.milestones.some((step) => step.validation.isValid === false);
      }
    },
    methods: {
      nextStep() {
        if (this.validate()) {
          // this.$emit('finish');
          this.$emit('incStep');
        }
      },
      prevStep() {
        this.$emit('decStep');
      },

      validate() {
        const { milestones } = this.research;
        for (let index = 0; index < milestones.length; index++) {
          let isValid;
          const step = milestones[index];
          if (step.goal == '') {
            isValid = false;
            Vue.set(step.validation, 'goalError', index === milestones.length - 1 ? 'Research should have the primary Goal' : 'Step Goal is required');
          }
          if (step.budget == '') {
            isValid = false;
            Vue.set(step.validation, 'budgetError', index === milestones.length - 1 ? 'Research should have the estimated budget' : 'Step budget is required');
          }
          if (step.purpose == '') {
            isValid = false;
            Vue.set(step.validation, 'purposeError', index === milestones.length - 1 ? 'Research should have the budget purpose' : 'Step purpose is required');
          }
          if (!step.eta /* || moment(step.eta).diff(moment(), 'days') < 0 */) {
            isValid = false;
            Vue.set(step.validation, 'etaError', step.eta == '' ? 'Goal deadline should be specified' : 'Goal deadline can not be in the Past');
          }

          Vue.set(step.validation, 'isValid', isValid !== false);
        }
        return milestones.every((step) => step.validation.isValid);
      }
    }
  };
</script>

<style lang="less" scoped>
  .milestone-devider {
    position: absolute;
    border-right: 1px solid;
    height: 29px;
    bottom: 0;
    top: calc(100% - 6px);
    left: calc(50%);
  }

  .milestone-devider.last {
    border-color: #ddd;
    height: 50px;
  }

  .remove-milestone {
    .remove-icon {
      display: none;
    }

    &:hover {
      .number-icon {
        display: none;
      }

      .remove-icon {
        display: block;
      }
    }
  }
</style>
