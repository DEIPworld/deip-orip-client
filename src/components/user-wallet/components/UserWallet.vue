<template>
  <base-page-layout>
    <!-- <v-container slot="content" fluid fill-height class="full-width full-height ma-0 pa-0"> -->
      <v-card slot="content" class="full-height full-width pa-5">
        <v-layout column>
          <v-layout align-center>
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg4 class="title bold">Balance</v-flex>
            <v-flex lg2 class="pr-2">
              <v-btn @click="openWithdrawDialog()" color="#2962FF" outline block>Withdraw</v-btn>
            </v-flex>
            <v-flex lg2 class="pl-2">
              <v-btn @click="openDepositDialog()" color="#2962FF" block dark>Deposit</v-btn>
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
                <v-flex lg5 class="bold subheading">{{(getAvailableCurrencyAmount('eur')) | currency({ symbol: '€' }) }}</v-flex>
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
                <v-flex lg5 class="bold subheading">{{getAvailableCurrencyAmount('usd') | currency}}</v-flex>
                <v-flex lg1 class="pl-3">
                  <v-icon class="balance-table__action" color="grey">more_vert</v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout column class="my-5" v-if="investments.length">
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
                      <div class="body-2">{{mockTokenPrice(investment.research.id, 1) | currency }}</div>
                      <div class="mt-1 caption text-uppercase grey--text">Price per token</div>
                    </v-flex>
                    <v-flex>
                      <div class="body-2">{{convertToPercent(investment.myShare.amount)}}%</div>
                      <div class="mt-1 caption text-uppercase grey--text">Your ownership share</div>
                    </v-flex>
                    <v-flex>
                      <div class="body-2">{{mockTokenPrice(investment.research.id, investment.myShare.amount) | currency}}</div>
                      <div class="mt-1 caption text-uppercase grey--text">Your ownership value</div>
                    </v-flex>
                    <v-flex>
                      <div class="body-2">{{mockTokenPrice(investment.research.id, DEIP_100_PERCENT)| currency}}</div>
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


        <v-dialog v-model="addBankCardDialog.isOpened" persistent max-width="500px">
          <v-card class="px-5 py-2">
            <v-card-title class="">
              <span class="headline">Add bank card</span>
            </v-card-title>
            <!-- <v-card-text> -->
              <v-layout row wrap>
                <v-flex xs12><v-credit-card @change="creditInfoChanged"/></v-flex>
                <v-flex xs12>
                  <div class="pb-3 px-5">
                    <v-checkbox
                      label="I confirm that I am qualified investor"
                      v-model="addBankCardDialog.termsConfirmed"
                      hide-details
                    ></v-checkbox>
                  </div>
                </v-flex>
              </v-layout>
            <!-- </v-card-text> -->
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs12 class="py-2">
                  <v-btn @click="saveBankCard()" color="primary" block :disabled="isSavingBankCardDisabled || addBankCardDialog.isSaving" :loading="addBankCardDialog.isSaving">Add Card</v-btn>
                </v-flex>
                <v-flex xs12 class="py-2">
                  <v-btn @click="closeAddBankCardDialog()" color="primary" block flat>Cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="depositDialog.isOpened" persistent max-width="500px">
          <v-card class="px-5 py-2">
            <v-card-title class="">
              <span class="headline">Deposit</span>
            </v-card-title>
            <!-- <v-card-text> -->
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout column class="full-width">
                    <v-radio-group v-model="depositDialog.selectedCurrency" class="currency-picker full-width align-center  ma-0 pa-0">
                      <v-radio
                        v-for="currencyType in currencyTypes"
                        :value="currencyType.id"
                        :key="currencyType.id"
                        class="currency-item row justify-space-between ma-0 pa-4 full-width"
                        color="grey darken-1"
                        style="flex-direction: row-reverse"
                      >
                        <template slot="label">
                          <v-layout row justify-space-between align-center class="full-width px-2">
                            <div class="bold">
                              <v-layout column justify-center align-center>
                                <img width="50px: height: 50px" :src="`../../../../static/currency/${currencyType.id}.png`"/>
                                <span class="pt-2 black--text">{{currencyType.title}}</span>
                              </v-layout>
                            </div>
                            <div>
                              <div class="black--text half-bold">{{ getAvailableCurrencyAmount(currencyType.id) | currency({ symbol: currencyType.symbol }) }}</div>
                            </div>
                          </v-layout>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    class=""
                    label="Amount" 
                    v-model="depositDialog.amount">
                  </v-text-field>
                </v-flex>
              </v-layout>
            <!-- </v-card-text> -->
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs12 class="py-2">
                  <v-btn @click="deposit()" color="primary" block :disabled="isDepositingDisabled || depositDialog.isDepositing" :loading="depositDialog.isDepositing">Deposit</v-btn>
                </v-flex>
                <v-flex xs12 class="py-2">
                  <v-btn @click="closeDepositDialog()" color="primary" block flat>Cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="withdrawDialog.isOpened" persistent max-width="500px">
          <v-card class="px-5 py-2">
            <v-card-title class="">
              <span class="headline">Withdraw</span>
            </v-card-title>
            <!-- <v-card-text> -->
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout column class="full-width">
                    <v-radio-group v-model="withdrawDialog.selectedCurrency" class="currency-picker full-width align-center  ma-0 pa-0">
                      <v-radio
                        v-for="currencyType in currencyTypes"
                        :value="currencyType.id"
                        :key="currencyType.id"
                        class="currency-item row justify-space-between ma-0 pa-4 full-width"
                        color="grey darken-1"
                        style="flex-direction: row-reverse"
                      >
                        <template slot="label">
                          <v-layout row justify-space-between align-center class="full-width px-2">
                            <div class="bold">
                              <v-layout column justify-center align-center>
                                <img width="50px: height: 50px" :src="`../../../../static/currency/${currencyType.id}.png`"/>
                                <span class="pt-2 black--text">{{currencyType.title}}</span>
                              </v-layout>
                            </div>
                            <div>
                              <div class="black--text half-bold">{{ getAvailableCurrencyAmount(currencyType.id) | currency({ symbol: currencyType.symbol }) }}</div>
                            </div>
                          </v-layout>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    class=""
                    label="Amount" 
                    v-model="withdrawDialog.amount">
                  </v-text-field>
                </v-flex>
              </v-layout>
            <!-- </v-card-text> -->
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs12 class="py-2">
                  <v-btn @click="withdraw()" color="primary" block :disabled="isWithdrawDisabled || withdrawDialog.isWithdrawing" :loading="withdrawDialog.isWithdrawing">Withdraw</v-btn>
                </v-flex>
                <v-flex xs12 class="py-2">
                  <v-btn @click="closeWithdrawDialog()" color="primary" block flat>Cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
    <!-- </v-container> -->
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import * as bankCardsStorage from './../../../utils/bankCard';

  const currencyTypes = {
    eur: { id: "eur", title: "EUR", symbol: "€" },
    usd: { id: "usd", title: "USD", symbol: "$" }
  }

  export default {
    name: "UserWallet",

    data() { 
      return {
        dialog: false,
        expandedInvestmentIdx: -1,

        addBankCardDialog: {
          data: {
            name: '',
            cardNumber: '',
            expiration: '',
            security: ''
          },

          isOpened: false,
          termsConfirmed: false,
          isSaving: false
        },

        withdrawDialog: {
          amount: 0,
          selectedCurrency: currencyTypes.usd.id,
          isOpened: false,
          isWithdrawing: false
        },

        depositDialog: {
          amount: 0,
          selectedCurrency: currencyTypes.usd.id,
          isOpened: false,
          isDepositing: false
        },
        currencyTypes: Object.values(currencyTypes)
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        investments: 'userWallet/investments'
      }),

      isSavingBankCardDisabled() {
        return !this.addBankCardDialog.data.name 
        || !this.addBankCardDialog.data.cardNumber 
        || this.addBankCardDialog.data.cardNumber.length < 19
        || !this.addBankCardDialog.data.expiration
        || !this.addBankCardDialog.data.security 
        || this.addBankCardDialog.data.security < 3
        || !this.addBankCardDialog.termsConfirmed;
      },

      isWithdrawDisabled() {
        return !this.withdrawDialog.amount;
      },

      isDepositingDisabled() {
        return !this.depositDialog.amount;
      },

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

          let investment = this.investments[this.expandedInvestmentIdx];
          return {
            data: [
              ['Date', 'Price', 'Average'],
              [moment().day(-10).toDate(), ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 10) ],
              [moment().day(-9).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 9)  ],
              [moment().day(-8).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 8)  ],
              [moment().day(-7).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 7)  ],
              [moment().day(-6).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 6)  ],
              [moment().day(-5).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 5)  ],
              [moment().day(-4).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 4)  ],
              [moment().day(-3).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 3)  ],
              [moment().day(-2).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 2)  ],
              [moment().day(-1).toDate(),  ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 1)  ],
              [moment().toDate(),          ...this.mockSharePriceWithAvg({ ...investment, share: investment.myShare }, 0)  ],
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

      openDepositDialog() {
        if (bankCardsStorage.hasInvestorBankCard()) {
          this.depositDialog.amount = 0;
          this.depositDialog.selectedCurrency = currencyTypes.usd.id;
          this.depositDialog.isOpened = true;
        } else {
          this.openAddBankCardDialog();
        }
      },

      closeDepositDialog() {
        this.depositDialog.isOpened = false;
      },

      openWithdrawDialog() {
        if (bankCardsStorage.hasInvestorBankCard()) {
          this.withdrawDialog.amount = 0;
          this.withdrawDialog.selectedCurrency = currencyTypes.usd.id;
          this.withdrawDialog.isOpened = true;
        } else {
          this.openAddBankCardDialog();
        }
      },

      closeWithdrawDialog() {
        this.withdrawDialog.isOpened = false;
      },
      
      openAddBankCardDialog() {
        this.addBankCardDialog.data.name = "";
        this.addBankCardDialog.data.cardNumber = "";
        this.addBankCardDialog.data.expiration = "";
        this.addBankCardDialog.data.security = "";
        this.addBankCardDialog.termsConfirmed = false;
        this.addBankCardDialog.isOpened = true;
      },

      closeAddBankCardDialog() {
        this.addBankCardDialog.isOpened = false;
      },

      saveBankCard() {
        this.addBankCardDialog.isSaving = true;
        setTimeout(() => {
          bankCardsStorage.saveInvestorBankCard(this.addBankCardDialog.data);
          this.$store.dispatch('layout/setSuccess', { message: "Bank Card has been added successfully!"});
          this.addBankCardDialog.isSaving = false;
          this.addBankCardDialog.isOpened = false;
        }, 1000);
      },

      deposit() {
        this.depositDialog.isDepositing = true;
        setTimeout(() => {
          this.$store.dispatch('layout/setSuccess', { message: "Funds have been deposited successfully!"});
          this.depositDialog.isDepositing = false;
          this.depositDialog.isOpened = false;
        }, 1000);
      },

      withdraw() {
        this.withdrawDialog.isWithdrawing = true;
        setTimeout(() => {
          this.$store.dispatch('layout/setSuccess', { message: "Funds have been withdrawn successfully!"});
          this.withdrawDialog.isWithdrawing = false;
          this.withdrawDialog.isOpened = false;
        }, 1000);
      },
      
      creditInfoChanged(values) {
        for (const key in values) {
            this.addBankCardDialog.data[key] = values[key];
        }
      },

      getAvailableCurrencyAmount(currencyId) {
        if (currencyTypes.eur.id == currencyId) {
          return this.fromAssetsToFloat(this.user.account.balance) * 1.10;
        } else if (currencyTypes.usd.id == currencyId) {
          return this.fromAssetsToFloat(this.user.account.balance)
        }
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
