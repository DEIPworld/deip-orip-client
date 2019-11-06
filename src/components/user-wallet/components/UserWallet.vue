<template>
  <page-container>
    <div class="full-width">
      <v-layout column class="my-5">
        <v-layout align-center>
          <v-flex lg1>
            <v-layout justify-end class="pr-3">
              <v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon>
            </v-layout>
          </v-flex>
          <v-flex lg4 class="title bold">Balance</v-flex>
          <v-flex lg2 class="pr-2">
            <v-btn outline block color="#2962FF">Withdraw</v-btn>
          </v-flex>
          <v-flex lg2 class="pl-2">
            <v-btn color="#2962FF" block dark>Deposit</v-btn>
          </v-flex>
        </v-layout>
        <v-layout class="mt-4">
          <v-flex lg8 offset-lg1 class="balance-table">
            <v-layout class="balance-table__line balance-table__line--header">
              <v-flex lg5 offset-lg1 class="grey--text">Currency</v-flex>
              <v-flex lg5 class="grey--text">Amount</v-flex>
              <v-flex lg1 class="grey--text">Actions</v-flex>
            </v-layout>
            <v-layout class="balance-table__line" align-center>
              <v-flex lg1>
                <v-layout justify-center align-center>
                  <img src="/static/eur-blue-round.svg" />
                </v-layout>
              </v-flex>
              <v-flex lg5 class="bold subheading">EUR</v-flex>
              <v-flex lg5 class="bold subheading">3,000,000</v-flex>
              <v-flex lg1 class="pl-3">
                <v-icon color="grey" class="balance-table__action">more_vert</v-icon>
              </v-flex>
            </v-layout>
            <v-layout class="balance-table__line" align-center>
              <v-flex lg1>
                <v-layout justify-center align-center>
                  <img src="/static/usd-green-round.svg" />
                </v-layout>
              </v-flex>
              <v-flex lg5 class="bold subheading">USD</v-flex>
              <v-flex lg5 class="bold subheading">5,000,000</v-flex>
              <v-flex lg1 class="pl-3">
                <v-icon class="balance-table__action" color="grey">more_vert</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </div>
  </page-container>
</template>

<script>
  export default {
    name: "UserWallet",

    data() { 
      return {
      }
    },

    computed: {
    },

    methods: {
    },
      
    created() {
    }
  };
</script>

<style lang="less" scoped>
  .balance-table {
    font-family: Roboto;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    &__line {
      border-top: 1px solid #E5E5E5;
      padding: 16px 0;
      &:last-child {
        border-bottom: 1px solid #E5E5E5;
      }
      &:hover {
        background-color: rgba(187, 222, 251, 0.2);
      }
      &--header {
        &:hover {
          background-color: inherit;
        }
      }
    }
    &__action {
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
