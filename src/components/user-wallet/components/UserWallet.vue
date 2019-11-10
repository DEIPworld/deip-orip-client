<template>
  <base-page-layout>
    <v-card slot="content" class="full-width pa-5">
      <v-layout column>
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
              <v-flex lg5 class="bold subheading">{{(fromAssetsToFloat(user.account.balance) * 1.10) | currency({ symbol: '€' }) }}</v-flex>
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
              <v-flex lg5 class="bold subheading">{{fromAssetsToFloat(user.account.balance) | currency}}</v-flex>
              <v-flex lg1 class="pl-3">
                <v-icon class="balance-table__action" color="grey">more_vert</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout column class="my-5">
        <v-layout align-center>
          <v-flex lg1>
            <v-layout justify-end class="pr-3">
              <v-icon large color="grey lighten-2">mdi-account-box</v-icon>
            </v-layout>
          </v-flex>
          <v-flex grow class="title bold">Portfolio</v-flex>
        </v-layout>
        <v-layout>
          <v-flex lg10 offset-lg1 class="portfolio">
            <div v-for="(investment, index) of investments" :key="'investment-' + index" class="my-4">
              <v-layout column class="portfolio__item-header py-4">
                <div class="a subheading ellipsis">{{investment.research.title}}</div>
                <v-layout row class="mt-2">
                  <v-flex>
                    <div class="body-2">{{investment.myShare.amount}}</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your number of tokens</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">{{mockTokensPrice(investment.research.id, 1) | currency }}</div>
                    <div class="mt-1 caption text-uppercase grey--text">Price per token</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">{{convertToPercent(investment.myShare.amount)}}%</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your ownership share</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">{{mockTokensPrice(investment.research.id, investment.myShare.amount) | currency}}</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your ownership value</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">{{mockTokensPrice(investment.research.id, DEIP_100_PERCENT) | currency}}</div>
                    <div class="mt-1 caption text-uppercase grey--text">Total value</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2 green--text text-accent-4">+{{mockPriceChange(investment.research.id).toFixed(2)}}%</div>
                    <div class="mt-1 caption text-uppercase grey--text">Price change</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">{{investment.shareHolders.length}}</div>
                    <div class="mt-1 caption text-uppercase grey--text"># of tokenholders</div>
                  </v-flex>
                  <v-flex>
                    <v-btn outline color="primary" class="ma-0" @click="toggleInvestmentDetails(index)">
                      {{expandedInvestmentIdx === index ? 'Less' : 'More'}}
                      <v-icon
                        small
                        right
                        color="primary"
                      >{{`keyboard_arrow_${expandedInvestmentIdx === index ? 'up' : 'down'}`}}</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout v-if="expandedInvestmentIdx === index" row class="portfolio__item-stats py-4">
                <v-flex lg7>
                  <div class="title">Share price</div>
                  <div class="mt-4">
                    <GChart
                      type="ComboChart"
                      :settings="{ packages: ['corechart'] }"
                      :data="sharePriceChart.data"
                      :options="sharePriceChart.options"
                    />
                  </div>
                </v-flex>
                <v-flex lg5>
                  <div class="title">Share holders</div>
                  <div class="mt-4">
                    <GChart
                      type="PieChart"
                      :settings="{ packages: ['corechart'] }"
                      :data="shareHoldersChart.data"
                      :options="shareHoldersChart.options"
                    />
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: "UserWallet",

    data() { 
      return {
        expandedInvestmentIdx: -1
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        investments: 'userWallet/investments'
      }),

      shareHoldersChart() {
        if (this.expandedInvestmentIdx != -1) {
          let investment = this.investments[this.expandedInvestmentIdx];
          return {
            data: [
              ['Share holders', ''],
              ...investment.shareHolders.map((shareHolder) => [
                this.$options.filters.fullname(shareHolder),
                this.convertToPercent(shareHolder.share.amount)
              ]),
              [investment.group.name, this.convertToPercent(investment.research.owned_tokens)]
            ],

            options: {
              title: '',
              legend: {
                position: 'left',
                textStyle: {
                  fontSize: 14,
                },
              },
              colors: ['#5BC9F5', '#A6DCFF', '#2CD9C5', '#2D99FF', '#2962FF'],
              chartArea: {
                width: '100%',
                height: '100%',
              },
              pieSliceTextStyle: {
                color: '#000000',
                fontSize: 12,
              },
              pieHole: 0.6,
            },
          };
        }
      },
      sharePriceChart() {

        if (this.expandedInvestmentIdx != -1) {

          let mockPrice = ({ research, myShare }, offset) => {
            let factor1 = (offset || 1) % 2 == 0;
            let factor2 = (research.id || 1) % 2 == 0;
            let pricePerToken = this.mockTokensPrice(research.id, 1);
            let currentSharePrice = this.mockTokensPrice(research.id, myShare.amount);
            let previousPrice = currentSharePrice - (factor1 ? offset * (factor2 ? pricePerToken : pricePerToken / 2) : offset + 1 * pricePerToken);
            return [previousPrice, currentSharePrice - (currentSharePrice - previousPrice) - pricePerToken * 10];
          };

          let investment = this.investments[this.expandedInvestmentIdx];

          return {
            data: [
              ['Date', 'Price', 'Average'],
              [moment().day(-10).toDate(), ...mockPrice(investment, 10) ],
              [moment().day(-9).toDate(),  ...mockPrice(investment, 9)  ],
              [moment().day(-8).toDate(),  ...mockPrice(investment, 8)  ],
              [moment().day(-7).toDate(),  ...mockPrice(investment, 7)  ],
              [moment().day(-6).toDate(),  ...mockPrice(investment, 6)  ],
              [moment().day(-5).toDate(),  ...mockPrice(investment, 5)  ],
              [moment().day(-4).toDate(),  ...mockPrice(investment, 4)  ],
              [moment().day(-3).toDate(),  ...mockPrice(investment, 3)  ],
              [moment().day(-2).toDate(),  ...mockPrice(investment, 2)  ],
              [moment().day(-1).toDate(),  ...mockPrice(investment, 1)  ],
              [moment().toDate(),          ...mockPrice(investment, 0)  ],
            ],
            options: {
              title: '',
              legend: {
                position: 'none',
              },
              series: {
                0: {
                  type: 'line',
                  color: '#2CD9C5',
                },
                1: {
                  type: 'area',
                  areaOpacity: 1,
                  color: '#EDF0F4'
                },
              },
            },
          };
        }
      }
    },

    methods: {
      toggleInvestmentDetails(index) {
        if (this.expandedInvestmentIdx === index) {
          this.expandedInvestmentIdx = -1;
        } else {
          this.expandedInvestmentIdx = index;
        }
      },

      mockTokensPrice(rtId, amount) {
        let pricePerToken = Math.pow(rtId || 2, 2);
        return amount * pricePerToken;
      },

      mockPriceChange(rtId) {
        return rtId * 0.3;
      }
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
  .v-expansion-panel {
    box-shadow: none;
    background-color: #fafafa;
    &__container,
    &__header,
    &__body {
      background: #fafafa !important;
    }
  }

  .portfolio {
    font-family: Roboto;
    font-style: normal;
    &__item-header {
      font-weight: 500;
    }
    &__item-stats {
    }
  }
</style>
