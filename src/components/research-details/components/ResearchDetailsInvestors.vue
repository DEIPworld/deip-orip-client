<template>
  <div v-if="investors.length || isActiveTokenSale" class="my-6">
    <v-row no-gutters>
      <v-col cols="auto" class="pr-4">
        <v-icon large color="grey lighten-2">
          mdi-account-box
        </v-icon>
      </v-col>
      <v-col class="rd-block-header align-self-center">
        Investors: {{ investors.length }}
      </v-col>
    </v-row>

    <div class="mb-12">
      <v-row justify="start" class="mt-2">
        <v-col cols="auto" class="rd-investment-info">
          <span class="rd-investment-info__value">${{ investmentsAmount }}</span>
          <br>
          <span class="rd-investment-info__value-text">Total investments</span>
        </v-col>
        <v-col cols="auto" class="rd-investment-info">
          <span class="rd-investment-info__value">${{ averageInvestmentAmount }}</span>
          <br>
          <span class="rd-investment-info__value-text">Average investment</span>
        </v-col>
        <v-col cols="auto" v-if="!isResearchGroupMember" class="rd-investment-info">
          <span class="rd-investment-info__value">${{ userInvestment }}</span>
          <br>
          <span class="rd-investment-info__value-text">Your investment</span>
        </v-col>
      </v-row>

      <v-row no-gutters justify="start" class="mt-2">
        <v-col
          cols="auto"
          v-for="(investor, i) in investors"
          :key="'investor-' + i"
        >
          <platform-avatar
            :size="40"
            :user="investor"
            class="mr-1"
          />
        </v-col>
      </v-row>
    </div>
    <v-divider />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchDetailsInvestors',

    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        tokenSalesList: 'rd/tokenSalesList',
        userContributionsList: 'rd/userContributionsList',
        tokenHoldersList: 'rd/tokenHoldersList',
        contributionsList: 'rd/contributionsList',
        tokenSale: 'rd/tokenSale'
      }),
      isActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },
      investors() {
        return [...this.tokenHoldersList, ...this.contributionsList].reduce(
          (acc, share) => (share.is_compensation ? acc : [...acc, share.user]),
          []
        );
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      },
      investmentsAmount() {
        return this.tokenSalesList
          .filter((e) => [1, 2].includes(e.status))
          .map((e) => this.fromAssetsToFloat(e.total_amount))
          .reduce((acc, curr) => (acc += curr), 0);
      },
      averageInvestmentAmount() {
        return this.round2DigitsAfterComma(
          this.investmentsAmount / (this.investors.length || 1)
        );
      },
      userInvestment() {
        const legitTokenSalesIds = this.tokenSalesList
          .filter((e) => [1, 2].includes(e.status))
          .map((e) => e.id);
        let amount = 0;
        this.userContributionsList.forEach((c) => {
          if (legitTokenSalesIds.includes(c.tokenSaleId)) {
            amount += this.fromAssetsToFloat(c.amount);
          }
        });
        return amount;
      }
    }
  };
</script>

<style lang="less" scoped>
  .rd-block-header {
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 0.25px;
    color: black;
  }

  .rd-investment-info {
    padding-right: 48px;

    &:last-child {
      padding-right: 0px;
    }

    &__value {
      font-family: Muli;
      font-weight: 900;
      font-size: 24px;
      color: #000000;
    }

    &__value-text {
      font-family: Roboto;
      font-size: 12px;
      color: #9e9e9e;
    }
  }
</style>
