<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="text-center text-h5 mb-3">
        Add title and number
      </div>

      <div>
        <v-text-field
          v-model="foa.title"
          outlined dense
          label="Opportunity title"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="foa.number"
          label="Opportunity number"
          outlined dense
          validate-on-blur
          :rules="[rules.required, rules.foaNumber]"
        />

        <v-text-field
          v-if="organization"
          v-model="organization.name"
          outlined dense
          label="Organization name"
          disabled
        />
      </div>

      <div class="text-center py-4">
        <v-btn color="primary" :disabled="isNextDisabled()" @click.native="nextStep()">
          Next
        </v-btn>
      </div>

    </v-col>
  </v-row>
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
