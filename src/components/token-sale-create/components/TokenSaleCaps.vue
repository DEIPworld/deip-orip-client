<template>
  <v-sheet>
    <div class="title">
      Select min and max amounts
    </div>
    <v-form ref="form" v-model="isFormValid">
      <v-text-field
        v-model="tokenSaleInfo.softCap"
        label="Min"
        :rules="[required, deipTokenValidator, softCapSmaller]"
        suffix="USD"
      />

      <v-text-field
        v-model="tokenSaleInfo.hardCap"
        label="Max"
        :rules="[required, deipTokenValidator, hardCapGreater]"
        suffix="USD"
      />
    </v-form>

    <v-btn text small class="mr-2" @click.native="prevStep()">
      <v-icon dark class="pr-1">
        keyboard_arrow_left
      </v-icon> Back
    </v-btn>

    <v-btn
      color="primary"
      :loading="isLoading"
      :disabled="!isFormValid || isLoading"
      @click.native="finish()"
    >
      {{ !isPersonalGroup ? 'Create Proposal' : 'Finish' }}
    </v-btn>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'TokenSaleCaps',

    props: {
      tokenSaleInfo: { type: Object, required: true },
      research: { type: Object },
      isLoading: { type: Boolean, required: true }
    },

    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup'
      }),

      isPersonalGroup() {
        return this.research && this.userPersonalGroup
          ? this.research.research_group_id === this.userPersonalGroup.id
          : false;
      }
    },

    data() {
      return {
        isFormValid: false,

        required: (value) => !!value || 'This field is required',

        softCapSmaller: () => {
          const isHardCapValid = this.deipTokenValidator(this.tokenSaleInfo.hardCap) === true;
          const isSoftCapValid = this.deipTokenValidator(this.tokenSaleInfo.softCap) === true;

          return !isHardCapValid
            || isSoftCapValid
            && isHardCapValid
            && parseFloat(this.tokenSaleInfo.hardCap) > parseFloat(this.tokenSaleInfo.softCap)
            || 'Min amount should be smaller than max amount';
        },

        hardCapGreater: () => {
          const isSoftCapValid = this.deipTokenValidator(this.tokenSaleInfo.softCap) === true;
          const isHardCapValid = this.deipTokenValidator(this.tokenSaleInfo.hardCap) === true;

          return !isSoftCapValid
            || isSoftCapValid
            && isHardCapValid
            && parseFloat(this.tokenSaleInfo.hardCap) > parseFloat(this.tokenSaleInfo.softCap)
            || 'Max amount should be greater than min amount';
        }
      };
    },

    methods: {
      finish() {
        this.$emit('finish');
      },
      prevStep() {
        this.$emit('decStep');
      }
    }
  };
</script>

<style lang="less" scoped>
    .caps-max-width {
        max-width: 500px;
    }
</style>
