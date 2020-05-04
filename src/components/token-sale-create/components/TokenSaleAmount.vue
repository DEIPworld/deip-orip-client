<template>
  <v-sheet>
    <div class="title">
      Determine the amount of research tokens for sale
    </div>
    <v-text-field
      v-model="tokenSaleInfo.amountToSell"
      :hint="ownedAmount - getAmountNumber(tokenSaleInfo.amountToSell) + ' left'"
      mask="#####"
      :rules="amountToSellRules"
    />

    <v-btn
      small
      text
      :to="{
        name: 'ResearchDetails',
        params: {
          group_permlink: encodeURIComponent(research.research_group.permlink),
          research_permlink: encodeURIComponent(research.permlink)
        }
      }"
    >
      Cancel
    </v-btn>

    <v-btn
      color="primary"
      :disabled="!verifyAmountRange(tokenSaleInfo.amountToSell)"
      @click.native="nextStep()"
    >
      Next
    </v-btn>
  </v-sheet>
</template>

<script>
  export default {
    name: 'TokenSaleAmount',
    props: {
      research: {
        type: Object,
        required: true
      },
      tokenSaleInfo: {
        type: Object,
        required: true
      },
      ownedAmount: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        amountToSellRules: [
          (v) => !!v || 'This field is required',
          (v) => this.verifyAmountRange(v) || `Amount should be from 1 to ${this.ownedAmount}`
        ]
      };
    },
    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      getAmountNumber(value) {
        return value === '' ? 0 : parseInt(value);
      },
      verifyAmountRange(value) {
        const amountNumber = this.getAmountNumber(value);
        return amountNumber > 0 && amountNumber <= this.ownedAmount;
      }
    }
  };
</script>

<style lang="less" scoped>
  .amount-max-width {
    max-width: 300px;
  }
</style>
