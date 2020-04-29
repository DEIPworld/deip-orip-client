<template>
  <div :v-show="steps.length" class="text--right">
    <milestone
      v-for="(step, index) in steps"
      :key="'milestone-' + index"
      :step="step"
      :is-main="steps.length - 1 === index"
      :is-first="index === 0"
      :is-last="steps.length - 1 === index"
      :is-read-only="isReadOnly"
      @removeStep="removeStep(index)"
      @insertStep="insertStep(index)"
      @clearValidation="clearValidation(index)"
    />

    <v-btn
      v-if="!isReadOnly"
      fab
      outlined
      class="my-0 pa-0 mx-2"
      color="primary"
      :small="$vuetify.breakpoint.smAndDown"
      :disabled="!isNewStepAvailable"
      @click="addStep"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Vue from 'vue';
  import moment from 'moment';

  function emptyStep(isMain) {
    return {
      goal: '',
      budget: '',
      purpose: '',
      eta: '',
      details: '',
      isMain,
      validation: {
        isValid: undefined,
        goalError: '',
        budgetError: '',
        purposeError: '',
        etaError: ''
      }
    };
  }

  function parseStep({
    goal, budget, purpose, eta, details, isMain
  } = {}) {
    return {
      goal: goal || '',
      budget: budget || '',
      purpose: purpose || '',
      eta: moment(eta).format('YYYY-MM-DD'),
      details: details || '',
      isMain: isMain || false,
      validation: {
        isValid: undefined,
        goalError: '',
        budgetError: '',
        purposeError: '',
        etaError: ''
      }
    };
  }


  export default {
    name: 'MilestoneStepper',
    props: {
      steps: { type: Array, required: true },
      isReadOnly: { type: Boolean, required: true }
    },
    computed: {
      isNewStepAvailable() {
        return this.steps.every(
          (step, index, array) => step.goal != '' && step.budget != '' && step.purpose != ''
        );
      }
    },
    created() {
      if (!this.isReadOnly && this.steps.length == 0) {
        this.steps.push(emptyStep(true));
      } else if (!this.isReadOnly && this.steps.length) {
        for (let i = 0; i < this.steps.length; i++) {
          const {
            goal, budget, purpose, eta, details
          } = this.steps[i];
          const isMain = i == this.steps.length - 1;
          this.steps.splice(i, 1, parseStep({
            goal, budget, purpose, eta, details, isMain
          }));
        }
      }
    },

    methods: {
      addStep() {
        this.steps.push(emptyStep(false));
      },
      removeStep(index) {
        this.steps.splice(index, 1);
      },
      insertStep(index) {
        this.steps.splice(index + 1, 0, emptyStep(false));
      },
      clearValidation(index) {
        this.steps.forEach((step, idx) => {
          if (idx === index) {
            Vue.set(step, 'validation', {
              isValid: undefined,
              goalError: '',
              budgetError: '',
              purposeError: '',
              etaError: ''
            });
          }
        });
      }
    }
  };

</script>

<style scoped>

</style>
