<template>
  <div class="display-flex flex-column full-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Add title and number
      </div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto meta-max-width">
          <v-text-field
            v-model="foa.title"
            filled
            label="Opportunity title"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="foa.number"
            label="Opportunity number"
            filled
            validate-on-blur
            :rules="[rules.required, rules.foaNumber]"
          />

          <v-text-field
            v-if="organization"
            v-model="organization.name"
            filled
            label="Organization name"
            disabled
          />
        </div>
      </div>
    </div>

    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn color="primary" :disabled="isNextDisabled()" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FundingOpportunityTitle',

    props: {
      foa: { type: Object, required: true },
      organization: { type: Object }
    },

    data() {
      return {
        MIN_FOA_NUMBER_LENGTH: 3,
        MAX_FOA_NUMBER_LENGTH: 15,
        rules: {
          required: (v) => !!v || 'This field is required',
          foaNumber: (v) => {
            if (v.length < this.MIN_FOA_NUMBER_LENGTH) {
              return `Award number length should be greater/equal than ${this.MIN_FOA_NUMBER_LENGTH}`;
            } if (v.length > this.MAX_FOA_NUMBER_LENGTH) {
              return `Award number length should be less/equal than ${this.MAX_FOA_NUMBER_LENGTH}`;
            }
            return /^[0-9]*$/.test(v) || 'Numbers are only allowed';
          }
        }
      };
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },

      isNextDisabled() {
        return !this.foa.title || !this.foa.number || this.foa.number.length < this.MIN_FOA_NUMBER_LENGTH || this.foa.number.length > this.MAX_FOA_NUMBER_LENGTH;
      }
    }
  };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
