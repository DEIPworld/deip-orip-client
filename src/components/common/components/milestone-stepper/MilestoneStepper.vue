<template>
  <div :v-show="steps.length" class="text-xs-right"> 
    <milestone v-for="(step, index) in steps" :key="'milestone-' + index"
      :step="step"
      :isMain="index === 0"
      :isLast="steps.length - 1 === index"
      :isReadOnly="isReadOnly"
      @remove-step="removeStep(index)"
      @insert-step="insertStep(index)"
      @remove-validation="removeValidation(index)">
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

function emptyStep(isMain) {
  return {
    target: '',
    eta: '',
    details: '',
    isMain: isMain,
    validation : {
      isValid: true
    }
  }
}

export default {
  name: 'MilestoneStepper',
  props: {
    steps: {
      type: Array,
      default () {
        return []
      }
    },
    isReadOnly: {
      type: Boolean,
      required: true
    }
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
    removeValidation: function(index){
      this.steps.forEach(function(step, idx){
        if(idx === index)
            step.validation.isValid = true;
      });
    }
  },
  computed: {
    isNewStepAvailable: function() {
      return this.steps.every(
        (step, index, array) => step.target != ''
      )
    }
  }
};

</script>

<style>

</style>

