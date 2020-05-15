<template>
  <layout-section>
    <content-block
      icon="mdi-cash-usd-outline"
      title="Balance"
    >
      <v-data-table
        :items="user.balances"
        :headers="tableHeaders"
        :hide-default-footer="true"
      >
        <template v-slot:item.icon="{ item }">
          <img
            v-if="assetsIcons[assetsInfo[item.asset_id].string_symbol]"
            class="max-width-26"
            :src="assetsIcons[assetsInfo[item.asset_id].string_symbol]"
          >
        </template>

        <template v-slot:item.amountAsset="{ item }">
          {{ assetsInfo[item.asset_id].string_symbol }}
        </template>

        <template v-slot:item.amountValue="{ item }">
          {{ getAvailableCurrencyAmount(item.amount) |
            currency({symbol:'',fractionCount:assetsInfo[item.asset_id].precision}) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu bottom left offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                icon
                v-on="on"
              >
                <v-icon color="grey">
                  more_vert
                </v-icon>
              </v-btn>
            </template>

            <v-list nav dense>
              <v-list-item @click="openSendTokensDialog(item)">
                <v-list-item-title>Transfer</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="isDepositAvailable(item.asset_id)"
                @click="openDepositDialog(item.asset_id)"
              >
                <v-list-item-title>Deposit</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="isWithdrawAvailable(item.asset_id)"
                @click="openWithdrawDialog(item.asset_id)"
              >
                <v-list-item-title>Withdraw</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </content-block>

    <content-block
      v-if="investments.length"
      icon="mdi-account-box"
      title="Portfolio"
    >
      <div v-for="(investment, index) of investments" :key="'investment-' + index" class="my-6">
        <div class="display-1">
          <router-link
            class="a subtitle-1 text-truncate"
            :to="{
              name: 'ResearchDetails',
              params: {
                research_group_permlink: encodeURIComponent(investment.research.research_group.permlink),
                research_permlink: encodeURIComponent(investment.research.permlink)
              }
            }"
          >
            {{ investment.research.title }}
          </router-link>
        </div>

        <v-row class="mt-2">
          <v-col>
            <div class="body-2">
              {{ investment.myShare.amount }}
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Your number of tokens
            </div>
          </v-col>
          <v-col>
            <div class="body-2">
              {{ mockTokenPrice(investment.research.id, 1) | currency }}
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Price per token
            </div>
          </v-col>
          <v-col>
            <div class="body-2">
              {{ convertToPercent(investment.myShare.amount) }}%
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Your ownership share
            </div>
          </v-col>
          <v-col>
            <div class="body-2">
              {{ mockTokenPrice(investment.research.id, investment.myShare.amount) | currency }}
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Your ownership value
            </div>
          </v-col>
          <v-col>
            <div class="body-2">
              {{ mockTokenPrice(investment.research.id, DEIP_100_PERCENT)| currency }}
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Total value
            </div>
          </v-col>
          <v-col>
            <div class="body-2 green--text text-accent-4">
              +{{ mockPriceChange(investment.research.id).toFixed(2) }}%
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              Price change
            </div>
          </v-col>
          <v-col>
            <div class="body-2">
              {{ investment.shareHolders.length + 1 }}
            </div>
            <div class="mt-1 caption text-uppercase grey--text">
              # of tokenholders
            </div>
          </v-col>
          <v-col>
            <v-btn
              text
              color="primary"
              class="ma-0"
              @click="toggleInvestmentDetails(index)"
            >
              {{ expandedInvestmentIdx === index ? 'Less' : 'More' }}
              <v-icon
                small
                right
                color="primary"
              >
                {{ `keyboard_arrow_${expandedInvestmentIdx === index ? 'up' : 'down'}` }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-sheet v-if="expandedInvestmentIdx === index">
          <v-row>
            <v-col class="xs">
              <div class="title">
                Share price
              </div>
              <div class="mt-6">
                <GChart
                  type="ComboChart"
                  :settings="{ packages: ['corechart'] }"
                  :data="sharePriceChart.data"
                  :options="sharePriceChart.options"
                />
              </div>
            </v-col>
            <v-col class="xs">
              <div class="title">
                Share holders
              </div>
              <div class="mt-6">
                <GChart
                  type="PieChart"
                  :settings="{ packages: ['corechart'] }"
                  :data="shareHoldersChart.data"
                  :options="shareHoldersChart.options"
                />
              </div>
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            outlined
            class="py-0 ma-0"
            @click="openSendResearchTokensDialog()"
          >
            Send research tokens
          </v-btn>
        </v-sheet>
      </div>
    </content-block>

    <v-dialog v-model="depositDialog.isOpened" persistent max-width="800px">
      <v-card class="pa-6">
        <v-card-title class="">
          <div class="subtitle-1 font-weight-bold">
            Deposit funds
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="closeDepositDialog()">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-row>
            <v-col cols="6" class="pr-12" style="border-right: 2px solid #E0E0E0">
              <v-credit-card v-if="depositDialog.isOpened" @change="creditInfoChanged" />
            </v-col>
            <v-col cols="6">
              <div class="display-flex flex-column justify-end pl-12 pr-4 fill-height">
                <div class="balance-form-input">
                  <label class="balance-form-input__label">Amount</label>
                  <input
                    v-model="depositDialog.amount"
                    class="balance-form-input__field"
                    type="text"
                    placehoder="Amount"
                  >
                </div>
                <div class="my-4">
                  <v-checkbox
                    v-model="depositDialog.termsConfirmed"
                    label="I confirm that I am qualified investor"
                    hide-details
                  />
                </div>
                <div class="my-4">
                  <v-btn
                    color="primary"
                    block
                    :disabled="isDepositingDisabled || depositDialog.isDepositing"
                    :loading="depositDialog.isDepositing"
                    @click="deposit()"
                  >
                    Deposit funds
                  </v-btn>
                </div>
                <div class="mb-6">
                  <v-btn
                    color="primary"
                    class="pa-0"
                    text
                    block
                    :disabled="depositDialog.isDepositing"
                    @click="closeDepositDialog()"
                  >
                    Cancel
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawDialog.isOpened" persistent max-width="800px">
      <v-card class="pa-6">
        <v-card-title class="">
          <div class="subtitle-1 font-weight-bold">
            Withdraw funds
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="closeWithdrawDialog()">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-row>
            <v-col cols="6" class="pr-12" style="border-right: 2px solid #E0E0E0">
              <div class="balance-form-input mx-4 mt-2">
                <label class="balance-form-input__label">Full name (Beneficiary)</label>
                <input
                  v-model="withdrawDialog.name"
                  class="balance-form-input__field"
                  type="text"
                >
              </div>
              <div class="balance-form-input mx-4 mt-4">
                <label class="balance-form-input__label">
                  IBAN
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">help</v-icon>
                    </template>

                    <span>International Bank Account Number. From 16 to 34 alphanumeric characters</span>
                  </v-tooltip>
                </label>
                <input
                  v-model="withdrawDialog.iban"
                  class="balance-form-input__field"
                  type="text"
                  maxlength="34"
                >
              </div>
              <div class="balance-form-input mx-4 mt-4">
                <label class="balance-form-input__label">
                  Reference number
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">help</v-icon>
                    </template>

                    <span>Most reference numbers will be found at the top of the application submission</span>
                  </v-tooltip>
                </label>
                <input
                  v-model="withdrawDialog.refNum"
                  class="balance-form-input__field"
                  type="text"
                >
              </div>
              <div class="balance-form-input mx-4 mt-4">
                <label class="balance-form-input__label">Message to Beneficiary</label>
                <textarea
                  v-model="withdrawDialog.messageText"
                  class="balance-form-input__field"
                  type="text"
                  rows="9"
                  style="resize: none"
                />
              </div>
            </v-col>
            <v-col cols="6" class="pl-4">
              <div class="display-flex flex-column justify-end pl-12 pr-4 fill-height">
                <div class="balance-form-input">
                  <label class="balance-form-input__label">Amount</label>
                  <input
                    v-model="withdrawDialog.amount"
                    class="balance-form-input__field"
                    type="text"
                  >
                </div>
                <div class="my-4">
                  <v-checkbox
                    v-model="withdrawDialog.termsConfirmed"
                    label="I confirm that I am qualified investor"
                    hide-details
                  />
                </div>
                <div class="my-4">
                  <v-btn
                    color="primary"
                    block
                    :disabled="isWithdrawDisabled || withdrawDialog.isWithdrawing"
                    :loading="withdrawDialog.isWithdrawing"
                    @click="withdraw()"
                  >
                    Withdraw funds
                  </v-btn>
                </div>
                <div class="mb-6">
                  <v-btn
                    color="primary"
                    class="pa-0"
                    text
                    block
                    :disabled="withdrawDialog.isWithdrawing"
                    @click="closeWithdrawDialog()"
                  >
                    Cancel
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendResearchTokensDialog.isOpened" persistent max-width="600px">
      <v-card class="pa-6">
        <v-card-title>
          <div class="title">
            Send Research Tokens
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="closeSendResearchTokensDialog()">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-form ref="sendResearchTokensForm" v-model="sendResearchTokensDialog.form.valid">
            <v-text-field
              :value="sendResearchTokensDialog.research.title"
              label="Research"
              disabled
            />
            <v-text-field
              v-model="sendResearchTokensDialog.form.to"
              label="To"
              :rules="sendResearchTokensDialog.form.rules.username"
              :disabled="sendResearchTokensDialog.isSending"
            />
            <v-text-field
              v-model="sendResearchTokensDialog.form.amount"
              label="Amount"
              :rules="sendResearchTokensDialog.form.rules.amount"
              :disabled="sendResearchTokensDialog.isSending"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col cols="12" class="py-2">
              <v-btn
                color="primary"
                block
                :disabled="!sendResearchTokensDialog.form.valid"
                :loading="sendResearchTokensDialog.isSending"
                @click="sendResearchTokens()"
              >
                Send
              </v-btn>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-btn
                color="primary"
                block
                text
                :disabled="sendResearchTokensDialog.isSending"
                @click="closeSendResearchTokensDialog()"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendTokensDialog.isOpened" persistent max-width="600px">
      <v-card class="pa-6">
        <v-card-title>
          <div class="title">
            Transfer - {{ sendTokensDialog.currency.title }}
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="closeSendTokensDialog()">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-form ref="sendTokensForm" v-model="sendTokensDialog.form.valid">
            <v-text-field
              v-model="sendTokensDialog.form.to"
              label="To"
              :rules="sendTokensDialog.form.rules.username"
              :disabled="sendTokensDialog.isSending"
            />
            <v-text-field
              v-model="sendTokensDialog.form.amount"
              label="Amount"
              :suffix="sendTokensDialog.currency.title"
              :rules="sendTokensDialog.form.rules.amount"
              :disabled="sendTokensDialog.isSending"
            />
            <v-textarea
              v-model="sendTokensDialog.form.memo"
              label="Memo - optional"
              rows="1"
              auto-grow
              :counter="sendTokensDialog.maxMemo"
              no-resize
              :rules="sendTokensDialog.form.rules.memo"
              :disabled="sendTokensDialog.isSending"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-btn
                color="primary"
                block
                :disabled="!sendTokensDialog.form.valid"
                :loading="sendTokensDialog.isSending"
                @click="sendTokens()"
              >
                Send
              </v-btn>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-btn
                color="primary"
                block
                text
                :disabled="sendTokensDialog.isSending"
                @click="closeSendTokensDialog()"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </layout-section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import * as bankCardsStorage from '../../../utils/bankCard';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  const fiatAssetBackedTokens = ['EUR', 'USD'];

  export default {
    name: 'UserWallet',
    components: { LayoutSection, ContentBlock },
    data() {
      const rules = {
        username: (value) => {
          if (!value) {
            return 'Receiver username is required';
          }

          if (value === this.user.username) {
            return 'Username shouldn\'t be yours';
          }

          return true;
        }
      };

      return {
        tableHeaders: [
          {
            text: '',
            value: 'icon',
            width: 24
          },
          {
            text: 'Asset',
            value: 'amountAsset'
          },
          {
            text: 'Amount',
            value: 'amountValue'
          },
          {
            text: '',
            value: 'actions',
            align: 'end'
          }
        ],

        dialog: false,
        expandedInvestmentIdx: -1,

        withdrawDialog: {
          amount: 0,
          precision: 0,
          name: '',
          iban: '',
          refNum: '',
          messageText: '',
          selectedCurrency: '',
          termsConfirmed: false,
          isOpened: false,
          isWithdrawing: false
        },

        depositDialog: {
          cardData: {
            name: '',
            cardNumber: '',
            expiration: '',
            security: ''
          },
          amount: 0,
          precision: 0,
          selectedCurrency: '',
          termsConfirmed: false,
          isOpened: false,
          isDepositing: false
        },

        sendResearchTokensDialog: {
          research: {
            id: null,
            title: null
          },
          form: {
            valid: false,
            to: '',
            amount: 0,
            rules: {
              username: [rules.username],
              amount: [
                (value) => {
                  const number = parseInt(value);
                  if (!number || number < 0) {
                    return 'Amount should be positive integer';
                  }
                  if (number > this.sendResearchTokensDialog.maxAmount) {
                    return 'Amount is greater than research token balance';
                  }

                  return true;
                }
              ]
            }
          },
          maxAmount: 0,
          isOpened: false,
          isSending: false
        },

        sendTokensDialog: {
          form: {
            valid: false,
            to: '',
            amount: 0,
            memo: '',
            rules: {
              username: [rules.username],
              amount: [
                (value) => {
                  const formatValidationResult = this.deipTokenValidator(value);
                  if (formatValidationResult !== true) {
                    return formatValidationResult;
                  }
                  if (value > this.sendTokensDialog.maxAmount) {
                    return 'Amount is greater than balance';
                  }

                  return true;
                }
              ],
              memo: [
                (value) => !value || !!value && value.length <= this.sendTokensDialog.maxMemo || 'String should be shorter'
              ]
            }
          },
          maxAmount: 0,
          precision: 0,
          maxMemo: 2000,
          isOpened: false,
          isSending: false,
          currency: {}
        },

        assetsIcons: {
          [window.env.ASSET_UNIT]: '/assets/img/currency/deip.png',
          USD: '/assets/img/currency/usd.png',
          EUR: '/assets/img/currency/eur.png'
        }
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        investments: 'userWallet/investments',
        assetsInfo: 'userWallet/assetsInfo'
      }),

      isWithdrawDisabled() {
        if (this.withdrawDialog.iban.length < 16) {
          return true;
        }

        const formatValidationResult = this.deipTokenValidator(this.withdrawDialog.amount);
        if (formatValidationResult !== true) {
          return true;
        }
        if (this.withdrawDialog.amount > this.getAvailableCurrencyAmount(this.withdrawDialog.selectedCurrency)) {
          return true;
        }
        if (!this.withdrawDialog.termsConfirmed) {
          return true;
        }
        return false;
      },

      isDepositingDisabled() {
        const isInvalidBankCard = !this.depositDialog.cardData.name
          || !this.depositDialog.cardData.cardNumber
          || this.depositDialog.cardData.cardNumber.length < 19
          || !this.depositDialog.cardData.expiration
          || !this.depositDialog.cardData.security
          || this.depositDialog.cardData.security < 3;

        if (isInvalidBankCard) {
          return true;
        }

        const formatValidationResult = this.deipTokenValidator(this.depositDialog.amount);
        if (formatValidationResult !== true) {
          return true;
        }
        if (!this.depositDialog.termsConfirmed) {
          return true;
        }

        return false;
      },

      shareHoldersChart() {
        if (this.expandedInvestmentIdx != -1) {
          const investment = this.investments[this.expandedInvestmentIdx];
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
                  fontSize: 14
                }
              },
              colors: ['#5BC9F5', '#A6DCFF', '#2CD9C5', '#2D99FF', '#2962FF'],
              chartArea: {
                width: '100%',
                height: '100%'
              },
              pieSliceTextStyle: {
                color: '#000000',
                fontSize: 12
              },
              pieHole: 0.6
            }
          };
        }
      },
      sharePriceChart() {
        if (this.expandedInvestmentIdx != -1) {
          const investment = this.investments[this.expandedInvestmentIdx];
          return {
            data: [
              ['Date', 'Price', 'Average'],
              [moment()
                .day(-10)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 10)],
              [moment()
                .day(-9)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 9)],
              [moment()
                .day(-8)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 8)],
              [moment()
                .day(-7)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 7)],
              [moment()
                .day(-6)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 6)],
              [moment()
                .day(-5)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 5)],
              [moment()
                .day(-4)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 4)],
              [moment()
                .day(-3)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 3)],
              [moment()
                .day(-2)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 2)],
              [moment()
                .day(-1)
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 1)],
              [moment()
                .toDate(), ...this.mockSharePriceWithAvg({
                ...investment,
                share: investment.myShare
              }, 0)]
            ],
            options: {
              title: '',
              legend: {
                position: 'none'
              },
              series: {
                0: {
                  type: 'line',
                  color: '#2CD9C5'
                },
                1: {
                  type: 'area',
                  areaOpacity: 1,
                  color: '#EDF0F4'
                }
              }
            }
          };
        }
      }
    },

    methods: {
      ...mapActions({
        loadResearchTokens: 'userWallet/loadResearchTokens',
        loadUserBalances: 'auth/loadBalances',
        loadWallet: ('userWallet/loadWallet')
      }),
      isTransferAvailable(assetId) {
        const symbol = this.assetsInfo[assetId].string_symbol;
        return !fiatAssetBackedTokens.some((s) => s == symbol);
      },
      isDepositAvailable(assetId) {
        const symbol = this.assetsInfo[assetId].string_symbol;
        return fiatAssetBackedTokens.some((s) => s == symbol);
      },
      isWithdrawAvailable(assetId) {
        const symbol = this.assetsInfo[assetId].string_symbol;
        return fiatAssetBackedTokens.some((s) => s == symbol);
      },
      toggleInvestmentDetails(index) {
        if (this.expandedInvestmentIdx === index) {
          this.expandedInvestmentIdx = -1;
        } else {
          this.expandedInvestmentIdx = index;
        }
      },

      openDepositDialog(assetId) {
        this.depositDialog.amount = 0;
        this.depositDialog.precision = this.assetsInfo[assetId].precision;
        this.depositDialog.selectedCurrency = this.assetsInfo[assetId].string_symbol;
        this.depositDialog.cardData.name = '';
        this.depositDialog.cardData.cardNumber = '';
        this.depositDialog.cardData.expiration = '';
        this.depositDialog.cardData.security = '';
        this.depositDialog.termsConfirmed = false;
        this.depositDialog.isOpened = true;
      },

      closeDepositDialog() {
        this.depositDialog.isOpened = false;
      },

      openWithdrawDialog(assetId) {
        this.withdrawDialog.amount = 0;
        this.withdrawDialog.precision = this.assetsInfo[assetId].precision;
        this.withdrawDialog.selectedCurrency = this.assetsInfo[assetId].string_symbol;
        this.withdrawDialog.name = '';
        this.withdrawDialog.iban = '';
        this.withdrawDialog.refNum = '';
        this.withdrawDialog.messageText = '';
        this.withdrawDialog.termsConfirmed = false;
        this.withdrawDialog.isOpened = true;
      },

      closeWithdrawDialog() {
        this.withdrawDialog.isOpened = false;
      },

      openSendResearchTokensDialog() {
        this.sendResearchTokensDialog.isOpened = true;
        setTimeout(() => {
          this.$refs.sendResearchTokensForm.reset();
        });

        const expandedInvestment = this.investments[this.expandedInvestmentIdx];
        this.sendResearchTokensDialog.research = {
          id: expandedInvestment.research.id,
          title: expandedInvestment.research.title
        };
        this.sendResearchTokensDialog.maxAmount = expandedInvestment.myShare.amount;
        this.sendResearchTokensDialog.form.valid = false;
        this.sendResearchTokensDialog.form.to = '';
        this.sendResearchTokensDialog.form.amount = 0;
      },

      closeSendResearchTokensDialog() {
        this.sendResearchTokensDialog.isOpened = false;
      },

      openSendTokensDialog(balance) {
        const currencyName = this.assetsInfo[balance.asset_id].string_symbol;
        setTimeout(() => this.$refs.sendTokensForm.reset());
        this.sendTokensDialog.isOpened = true;

        this.sendTokensDialog.maxAmount = this.getAvailableCurrencyAmount(balance.amount);
        this.sendTokensDialog.precision = this.assetsInfo[balance.asset_id].precision;
        this.sendTokensDialog.currency = {
          title: currencyName,
          currencyName
        };

        this.sendTokensDialog.form.valid = false;
        this.sendTokensDialog.form.to = '';
        this.sendTokensDialog.form.amount = 0;
        this.sendTokensDialog.form.memo = '';
      },

      closeSendTokensDialog() {
        this.sendTokensDialog.isOpened = false;
      },

      sendTokens() {
        this.sendTokensDialog.isSending = true;

        return deipRpc.broadcast.transferAsync(
          this.user.privKey,
          this.user.username,
          this.sendTokensDialog.form.to,
          this.toAssetUnits(this.sendTokensDialog.form.amount, this.sendTokensDialog.precision, this.sendTokensDialog.currency.currencyName),
          this.sendTokensDialog.form.memo ? this.sendTokensDialog.form.memo : ''
        )
          .then((data) => {
            this.$store.dispatch('layout/setSuccess', {
              message: 'Transfer was successfull'
            });
            this.closeSendTokensDialog();
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'Transaction was failed'
            });
          })
          .finally(() => {
            this.sendTokensDialog.isSending = false;
            return this.loadUserBalances();
          });
      },

      sendResearchTokens() {
        this.sendResearchTokensDialog.isSending = true;

        return deipRpc.broadcast.transferResearchTokensAsync(
          this.user.privKey,
          this.sendResearchTokensDialog.research.id,
          this.user.username,
          this.sendResearchTokensDialog.form.to,
          +this.sendResearchTokensDialog.form.amount
        )
          .then((data) => {
            this.$store.dispatch('layout/setSuccess', {
              message: 'Research tokens successfully sent'
            });
            this.closeSendResearchTokensDialog();
          })
          .catch((err) => {
            this.$store.dispatch('layout/setError', {
              message: 'Transaction was failed'
            });
            console.error(err);
          })
          .finally(() => {
            this.sendResearchTokensDialog.isSending = false;
            return this.loadResearchTokens(this.user.username);
          });
      },

      deposit() {
        this.depositDialog.isDepositing = true;
        return deipRpc.broadcast.transferAsync(
          '5J7xMbqRbaP4wnP3NnzPERR8msN6yrcXrZBbKenFiQpDjNcdvfc',
          'hermes',
          this.user.username,
          this.toAssetUnits(this.depositDialog.amount, this.depositDialog.precision, this.depositDialog.selectedCurrency),
          `deposit for ${this.user.username}`
        )
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Funds have been deposited successfully!' });
            this.closeDepositDialog();
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'Transaction was failed'
            });
          })
          .finally(() => {
            this.depositDialog.isDepositing = false;
            return this.loadUserBalances();
          });
      },

      withdraw() {
        this.withdrawDialog.isWithdrawing = true;
        return deipRpc.broadcast.transferAsync(
          this.user.privKey,
          this.user.username,
          'hermes',
          this.toAssetUnits(this.withdrawDialog.amount, this.withdrawDialog.precision, this.withdrawDialog.selectedCurrency),
          `withdraw for ${this.user.username}`
        )
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Funds have been withdrawn successfully!' });
            this.closeWithdrawDialog();
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'Transaction was failed'
            });
          })
          .finally(() => {
            this.withdrawDialog.isWithdrawing = false;
            return this.loadUserBalances();
          });
      },

      creditInfoChanged(values) {
        for (const key in values) {
          this.depositDialog.cardData[key] = values[key];
        }
      },

      getAvailableCurrencyAmount(balance) {
        return this.fromAssetsToFloat(balance);
      },

      mockPriceChange(rtId) {
        return rtId * 0.3;
      }
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

  .balance-form-input { // same as vue-credit card inputs
    color: #707070;

    &__label {
      padding-bottom: 5px;
      font-size: 13px;
    }

    &__field {
      box-sizing: border-box;
      margin-top: 3px;
      padding: 15px;
      font-size: 16px;
      width: 100%;
      border-radius: 3px;
      border: 1px solid #dcdcdc;
    }
  }

  .max-width-26 {
    max-width: 26px;
  }
</style>
