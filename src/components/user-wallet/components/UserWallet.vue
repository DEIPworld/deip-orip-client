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
            <div
              v-for="(pItem, index) of portfolioItems"
              :key="pItem.id"
              class="my-4"
            >
              <v-layout column class="portfolio__item-header py-4">
                <div class="a subheading">{{pItem.title}}</div>
                <v-layout row class="mt-2">
                  <v-flex>
                    <div class="body-2">5000</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your number of tokens</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">$735</div>
                    <div class="mt-1 caption text-uppercase grey--text">Price per token</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">50%</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your ownership share</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">$3,675,000</div>
                    <div class="mt-1 caption text-uppercase grey--text">Your ownership value</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">$7,350,000</div>
                    <div class="mt-1 caption text-uppercase grey--text">Total value</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2 green--text text-accent-4">+7%</div>
                    <div class="mt-1 caption text-uppercase grey--text">Price change</div>
                  </v-flex>
                  <v-flex>
                    <div class="body-2">2</div>
                    <div class="mt-1 caption text-uppercase grey--text"># of tokenholders</div>
                  </v-flex>
                  <v-flex>
                    <v-btn outline color="primary" class="ma-0" @click="onPortfolioDetailsBtnClick(index)">
                      {{pItem.areDetailsShown ? 'Less' : 'More'}}
                      <v-icon
                        small
                        right
                        color="primary"
                      >{{`keyboard_arrow_${pItem.areDetailsShown ? 'up' : 'down'}`}}</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout
                v-if="expandedPortfolioItemIndex === index"
                row
                class="portfolio__item-stats py-4"
              >
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
    </div>
  </page-container>
</template>

<script>
  export default {
    name: "UserWallet",

    data() { 
      return {
        expandedPortfolioItemIndex: -1,
        portfolioItems: [{
          id: 1,
          title: 'IT Asset Disposal & Recycling',
          areDetailsShown: false,
        }, {
          id: 2,
          title: 'E-waste management in the Philippines',
          areDetailsShown: false,
        }, {
          id: 3,
          title: 'Stepped Recycling: The Solution for E-waste Management and Sustainable Manufacturing in India',
          areDetailsShown: false,
        }]
      }
    },

    computed: {
      shareHoldersChart() {
        const weight = this.expandedPortfolioItemIndex * 31;
        return {
          data: [
            ['Share holders', ''],
            ['Dawn Mcclure', 15 + weight],
            ['Caelan Wyatt', 40 + weight],
            ['Emmanuella Ryder', 16 + weight],
            ['Darin Melia', 23 + weight],
            ['Aleesha Iles', 6 + weight],
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
      },
      sharePriceChart() {
        return {
          data: [
            ['Date', 'Price', 'Average'],
            [new Date('2019-12-07'),  2844,      938],
            [new Date('2019-12-08'),  3000,      1120],
            [new Date('2019-12-09'),  2799,      1167],
            [new Date('2019-12-10'),  3000,      1270],
            [new Date('2019-12-11'),  3000,      1470],
            [new Date('2019-12-12'),  3780,      1870],
            [new Date('2019-12-13'),  3820,      1570],
            [new Date('2019-12-14'),  3210,      2091],
            [new Date('2019-12-15'),  3340,      1890],
            [new Date('2019-12-16'),  3000,      1790],
            [new Date('2019-12-17'),  3570,      1130],
            [new Date('2019-12-18'),  3680,      1740],
            [new Date('2019-12-19'),  3390,      1921],
            [new Date('2019-12-20'),  4140,      1941],
            [new Date('2019-12-21'),  5040,      1945],
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
    },

    methods: {
      onPortfolioDetailsBtnClick(index) {
        this.expandedPortfolioItemIndex = index;
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
