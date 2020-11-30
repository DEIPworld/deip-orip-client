<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="text-center text-h5 mb-3">
        Add title and number
      </div>

      <d-stack class="pb-5">
        <attributes-set
          v-model="foa.grantNumber"
          :attribute="grantSelector"
        />
      </d-stack>
    
      <div>
        <v-text-field
          v-model="foa.title"
          outlined
          label="Opportunity title"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="foa.number"
          label="Opportunity number"
          outlined
          validate-on-blur
          :rules="[rules.required, rules.foaNumber]"
        />

        <v-text-field
          v-if="organization"
          v-model="organization.name"
          outlined
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
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'FundingOpportunityTitle',

    components: {
      DStack,
      AttributesSet
    },

    props: {
      foa: { type: Object, required: true },
      organization: { type: Object }
    },

    data() {
      return {
        grantLabelAttribute: null,
        MIN_FOA_NUMBER_LENGTH: 3,
        MAX_FOA_NUMBER_LENGTH: 15,
        rules: {
          required: (v) => !!v || this.$t('defaultNaming.fieldRules.required'),
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
    },

    created() {
      this.grantSelector = this.$tenantSettings.researchAttributes.find((attr) => { 
        return attr._id == this.$env.GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID;
      });
    }
  };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
