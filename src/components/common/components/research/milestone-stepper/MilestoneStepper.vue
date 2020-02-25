<template>
  <div :v-show="steps.length" class="text-xs-right"> 
    <milestone v-for="(step, index) in steps" :key="'milestone-' + index"
      :step="step"
      :isMain="steps.length - 1 === index"
      :isFirst="index === 0"
      :isLast="steps.length - 1 === index"
      :isReadOnly="isReadOnly"
      @removeStep="removeStep(index)"
      @insertStep="insertStep(index)"
      @clearValidation="clearValidation(index)">
    </milestone>

    <v-btn v-if="!isReadOnly" 
      fab
      outline
      class="my-0 pa-0 mx-2"
      color="primary" 
      @click='addStep' 
      :small="$vuetify.breakpoint.smAndDown" 
      :disabled="!isNewStepAvailable">
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
    isMain: isMain,
    validation : {
      isValid: undefined,
      goalError: '',
      budgetError: '',
      purposeError: '',
      etaError: ''
    }
  }
}

function parseStep({ goal, budget, purpose, eta, details, isMain } = {}) {
  return {
    goal: goal || '',
    budget: budget || '', 
    purpose: purpose || '',
    eta: moment(eta).format("YYYY-MM-DD"),
    details: details || '',
    isMain: isMain || false,
    validation : {
      isValid: undefined,
      goalError: '',
      budgetError: '',
      purposeError: '',
      etaError: ''
    }
  }
}


export default {
  name: 'MilestoneStepper',
  props: {
    steps: { type: Array, required: true },
    isReadOnly: { type: Boolean, required: true }
  },

  methods: {
    addStep: function() {
      this.steps.push(emptyStep(false));
    },
    removeStep: function(index) {
      this.steps.splice(index, 1);
    },
    insertStep: function(index) {
      this.steps.splice(index + 1, 0, emptyStep(false));
    },
    clearValidation: function(index) {
      this.steps.forEach(function(step, idx){
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
  },
  computed: {
    isNewStepAvailable: function() {
      return this.steps.every(
        (step, index, array) => step.goal != '' && step.budget != '' && step.purpose != ''
      )
    }
  },
  created() {
    if (!this.isReadOnly && this.steps.length == 0) {
      this.steps.push(emptyStep(true));
    } else if (!this.isReadOnly && this.steps.length) {
      for (let i = 0; i < this.steps.length; i++) {
        let { goal, budget, purpose, eta, details } = this.steps[i];
        let isMain = i == this.steps.length - 1;
        this.steps.splice(i, 1, parseStep({ goal, budget, purpose, eta, details, isMain }));
      }
    }
  }
};

</script>

<style scoped>

</style>

