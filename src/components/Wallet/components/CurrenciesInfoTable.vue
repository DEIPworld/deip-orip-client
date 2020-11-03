<template>
  <div>
    <v-data-table
      :items="accountData.balances"
      :headers="tableHeaders"
      disable-sort
      :hide-default-footer="true"
    >
      <template v-slot:item.amountAsset="{ item }">
        <v-chip
          outlined
        >
          <v-icon left color="primary">
            {{ assetsIcons[assetsInfo[item.asset_id].string_symbol] || assetsIcons.default }}
          </v-icon>
          {{ assetsInfo[item.asset_id].string_symbol }}
        </v-chip>
      </template>

      <template v-slot:item.amountValue="{ item }">
        <span class="text-body-2">
          {{ getAvailableCurrencyAmount(item.amount) |
            currency({symbol:'',fractionCount:assetsInfo[item.asset_id].precision}) }}
        </span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          outlined
          max-height="30"
          max-width="95"
          small
          :disabled="!isTransferAvailable"
          color="primary"
          class="text-caption my-4"
          @click="openSendTokensDialog(item)"
        >
          <v-icon left>
            mdi-bank-transfer
          </v-icon>
          Transfer
        </v-btn>
      </template>
      <template #item.actionMenu="{ item }">
        <v-menu
          v-if="isDepositAvailable(item.asset_id) || isWithdrawAvailable(item.asset_id)"
          bottom
          left
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              icon
              max-width="24"
              v-on="on"
            >
              <v-icon color="grey">
                more_vert
              </v-icon>
            </v-btn>
          </template>

          <v-list nav dense>
            <v-list-item
              v-if="isDepositAvailable(item.asset_id)"
              @click="openDepositDialog(item.asset_id)"
            >
              <v-list-item-title>{{ $t('userWallet.deposit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="isWithdrawAvailable(item.asset_id)"
              @click="openWithdrawDialog(item.asset_id)"
            >
              <v-list-item-title>{{ $t('userWallet.withdraw') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <v-dialog
      v-model="depositDialog.isOpened"
      persistent
      max-width="800px"
    >
      <v-card class="pa-6">
        <v-card-title class="">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t('userWallet.depositDialog.depositFunds') }}
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
              <v-credit-card
                v-if="depositDialog.isOpened"
                :trans="translations"
                @change="creditInfoChanged"
              />
            </v-col>
            <v-col cols="6">
              <div class="display-flex flex-column justify-end pl-12 pr-4 fill-height">
                <div class="balance-form-input">
                  <label class="balance-form-input__label">{{ $t('userWallet.depositDialog.amountField.label') }}</label>
                  <input
                    v-model="depositDialog.amount"
                    class="balance-form-input__field"
                    type="text"
                    :placehoder="$t('userWallet.depositDialog.amountField.placeholder')"
                  >
                </div>
                <div class="my-4">
                  <v-checkbox
                    v-model="depositDialog.termsConfirmed"
                    :label="$t('userWallet.depositDialog.confirmQualifiedField')"
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
                    {{ $t('userWallet.depositDialog.depositFunds') }}
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
                    {{ $t('userWallet.cancel') }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="withdrawDialog.isOpened"
      persistent
      max-width="800px"
    >
      <v-card class="pa-6">
        <v-card-title class="">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t('userWallet.withdrawDialog.withdrawFunds') }}
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
                <label class="balance-form-input__label">{{ $t('userWallet.withdrawDialog.nameField') }}</label>
                <input
                  v-model="withdrawDialog.name"
                  class="balance-form-input__field"
                  type="text"
                >
              </div>
              <div class="balance-form-input mx-4 mt-4">
                <label class="balance-form-input__label">
                  {{ $t('userWallet.withdrawDialog.idanField.label') }}
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">help</v-icon>
                    </template>

                    <span>{{ $t('userWallet.withdrawDialog.idanField.tooltip') }}</span>
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
                  {{ $t('userWallet.withdrawDialog.referenceField.label') }}
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">help</v-icon>
                    </template>

                    <span>{{ $t('userWallet.withdrawDialog.referenceField.tooltip') }}</span>
                  </v-tooltip>
                </label>
                <input
                  v-model="withdrawDialog.refNum"
                  class="balance-form-input__field"
                  type="text"
                >
              </div>
              <div class="balance-form-input mx-4 mt-4">
                <label class="balance-form-input__label">{{ $t('userWallet.withdrawDialog.beneficiaryField') }}</label>
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
                  <label class="balance-form-input__label">{{ $t('userWallet.withdrawDialog.amountField') }}</label>
                  <input
                    v-model="withdrawDialog.amount"
                    class="balance-form-input__field"
                    type="text"
                  >
                </div>
                <div class="my-4">
                  <v-checkbox
                    v-model="withdrawDialog.termsConfirmed"
                    :label="$t('userWallet.withdrawDialog.confirmQualifiedField')"
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
                    {{ $t('userWallet.withdrawDialog.withdrawFunds') }}
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
                    {{ $t('userWallet.cancel') }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <d-dialog
      v-model="sendTokensDialog.isOpened"
      title="Transfer asset"
      max-width="570px"
      :disabled="sendTokensDialog.isSending"
      :loading="sendTokensDialog.isSending"
      :confirm-button-title="$t('userWallet.sendTokensDialog.submitBtn')"
      :cancel-button-title="$t('userWallet.cancel')"
      @click:confirm="sendTokens()"
    >
      <v-form
        ref="sendTokensForm"
        v-model="sendTokensDialog.form.valid"
      >
        <v-select
          v-model="sendTokensDialog.form.asset"
          label="Asset"
          :items="accountData.balances"
          outlined
          return-object
          item-text="asset_id"
          item-value="asset_id"
        >
          <template #selection="{ item }">
            <div class="d-flex justify-space-between w-100 align-center">
              <div>
                <v-icon left>
                  {{ assetsIcons[assetsInfo[item.asset_id].string_symbol] || assetsIcons.default }}
                </v-icon>
                {{ assetsInfo[item.asset_id].string_symbol }}
              </div>
              <div>
                {{ getAvailableCurrencyAmount(item.amount)
                  | currency({symbol:'',fractionCount:assetsInfo[item.asset_id].precision}) }}
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="d-flex justify-space-between w-100">
              <div>
                <v-icon left>
                  {{ assetsIcons[assetsInfo[item.asset_id].string_symbol] || assetsIcons.default }}
                </v-icon>
                {{ assetsInfo[item.asset_id].string_symbol }}
              </div>
              <div>
                {{ getAvailableCurrencyAmount(item.amount)
                  | currency({symbol:'',fractionCount:assetsInfo[item.asset_id].precision}) }}
              </div>
            </div>
          </template>
        </v-select>
        <v-text-field
          v-model="sendTokensDialog.form.amount"
          label="Amount"
          :rules="sendTokensDialog.form.rules.amount"
          outlined
        />
        <v-autocomplete
          v-model="sendTokensDialog.form.receiver"
          :items="allAccounts"
          :rules="sendTokensDialog.form.rules.username"
          append-icon="search"
          :menu-props="{
            overflowX: true,
            maxWidth: 520
          }"
          label="Recipient"
          item-text="fullName"
          outlined
          return-object
        >
          <template #selection="{ item }">
            <d-box-item
              :avatar="
                item.account.is_research_group
                  ? $options.filters.researchGroupLogoSrc(
                    item.external_id,
                    24,
                    24
                  ) : $options.filters.avatarSrc(
                    item.profile,
                    24,
                    24,
                    false
                  )
              "
              :size="24"
            >
              <v-clamp :max-lines="1" class="text-body-2">
                {{ item.fullName }}
              </v-clamp>
            </d-box-item>
          </template>
          <template #item="{ item }">
            <d-box-item
              :avatar="
                item.account.is_research_group
                  ? $options.filters.researchGroupLogoSrc(
                    item.external_id,
                    24,
                    24
                  ) : $options.filters.avatarSrc(
                    item.profile,
                    24,
                    24,
                    false
                  )
              "
              :size="24"
            >
              <v-clamp :max-lines="1" class="text-body-2">
                {{ item.fullName }}
              </v-clamp>
            </d-box-item>
          </template>
        </v-autocomplete>
        <v-textarea
          v-model="sendTokensDialog.form.memo"
          outlined
          label="Notes"
          no-resize
          rows="8"
        />
      </v-form>
    </d-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { AssetsService } from '@deip/assets-service';

  const assetsService = AssetsService.getInstance();
  const fiatAssetBackedTokens = ['EUR', 'USD'];

  export default {
    name: 'CurrenciesInfoTable',

    components: {
      DDialog,
      DBoxItem
    },

    props: {
      allAccounts: {
        type: Array,
        default: () => []
      }
    },

    data() {
      const rules = {
        username: (value) => {
          if (!value) {
            return 'Receiver username is required';
          }

          if (value === this.$currentUserName) {
            return 'Username shouldn\'t be yours';
          }

          return true;
        }
      };
      return {
        translations: {
          name: {
            label: this.$t('userWallet.translations.name.label'),
            placeholder: this.$t('userWallet.translations.name.placeholder')
          },
          card: {
            label: this.$t('userWallet.translations.card.label'),
            placeholder: this.$t('userWallet.translations.card.placeholder')
          },
          expiration: {
            label: this.$t('userWallet.translations.expiration.label')
          },
          security: {
            label: this.$t('userWallet.translations.security.label'),
            placeholder: this.$t('userWallet.translations.security.placeholder')
          }
        },
        tableHeaders: [
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
          },
          {
            value: 'actionMenu',
            align: 'end',
            width: '24px'
          }
        ],
        assetsIcons: {
          [window.env.ASSET_UNIT]: 'mdi-bitcoin',
          USD: 'attach_money',
          EUR: 'euro',
          default: 'mdi-bitcoin'
        },
        sendTokensDialog: {
          form: {
            valid: false,
            to: '',
            amount: 0,
            asset: {},
            receiver: {},
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
        }
      };
    },

    computed: {
      ...mapGetters({
        assetsInfo: 'Wallet/assetsInfo',
        groupData: 'Wallet/groupData'
      }),
      accountData() {
        if (this.$route.name === 'userWallet') {
          return this.$currentUser;
        }
        if (this.$route.name === 'groupWallet') {
          return this.groupData;
        }
        return { balances: [] };
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
      isTransferAvailable() {
        if (this.$route.name === 'userWallet') {
          return true;
        }
        if (this.$route.name === 'groupWallet') {
          return this.$store.getters['auth/userIsResearchGroupMemberExId'](this.groupData.account.name);
        }
        return false;
      }
    },

    methods: {
      ...mapActions({
        loadResearchTokens: 'Wallet/loadResearchTokens',
        loadUserBalances: 'auth/loadBalances',
        loadWallet: ('Wallet/loadWallet')
      }),
      updateBalances() {
        if (this.$route.name === 'userWallet') {
          this.loadUserBalances();
        } else if (this.$route.name === 'groupWallet') {
          this.$store.dispatch('Wallet/loadBalanceData', this.$route.params.account)
            .then(() => { this.$setReady(); });
        }
      },
      closeWithdrawDialog() {
        this.withdrawDialog.isOpened = false;
      },
      closeDepositDialog() {
        this.depositDialog.isOpened = false;
      },
      getAvailableCurrencyAmount(balance) {
        return this.fromAssetsToFloat(balance);
      },
      openSendTokensDialog(balance) {
        this.sendTokensDialog.isOpened = true;

        this.sendTokensDialog.maxAmount = this.getAvailableCurrencyAmount(balance.amount);

        this.sendTokensDialog.form.asset = balance;
        this.sendTokensDialog.form.valid = false;
        this.sendTokensDialog.form.to = '';
        this.sendTokensDialog.form.amount = '';
        this.sendTokensDialog.form.memo = '';
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
      isDepositAvailable(assetId) {
        const symbol = this.assetsInfo[assetId].string_symbol;
        return fiatAssetBackedTokens.some((s) => s == symbol);
      },
      isWithdrawAvailable(assetId) {
        const symbol = this.assetsInfo[assetId].string_symbol;
        return fiatAssetBackedTokens.some((s) => s == symbol);
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
      withdraw() {
        this.withdrawDialog.isWithdrawing = true;
        return deipRpc.broadcast.transferAsync(
          this.$currentUser.privKey,
          this.$currentUser.username,
          'kim',
          this.toAssetUnits(this.withdrawDialog.amount, this.withdrawDialog.precision, this.withdrawDialog.selectedCurrency),
          `withdraw for ${this.$currentUser.username}`,
          []
        )
          .then(() => {
            this.$notifier.showSuccess('Funds have been withdrawn successfully!');
            this.closeWithdrawDialog();
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Transaction was failed');
          })
          .finally(() => {
            this.withdrawDialog.isWithdrawing = false;
            return this.updateBalances();
          });
      },
      deposit() {
        this.depositDialog.isDepositing = true;
        return deipRpc.broadcast.transferAsync(
          '5JBUoX9L6fjHmfwtK2S8ksEevmM3q6LzYncsdeoax5V662PehFa',
          'kim',
          this.$currentUser.username,
          this.toAssetUnits(this.depositDialog.amount, this.depositDialog.precision, this.depositDialog.selectedCurrency),
          `deposit for ${this.$currentUser.username}`,
          []
        )
          .then(() => {
            this.$notifier.showSuccess('Funds have been deposited successfully!');
            this.closeDepositDialog();
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Transaction was failed');
          })
          .finally(() => {
            this.depositDialog.isDepositing = false;
            return this.updateBalances();
          });
      },
      sendTokens() {
        this.sendTokensDialog.isSending = true;

        return deipRpc.broadcast.transferAsync(
          this.$currentUser.privKey,
          this.accountData.account.name,
          this.sendTokensDialog.form.receiver.account.name,
          this.toAssetUnits(
            this.sendTokensDialog.form.amount,
            this.assetsInfo[this.sendTokensDialog.form.asset.asset_id].precision,
            this.assetsInfo[this.sendTokensDialog.form.asset.asset_id].string_symbol
          ),
          this.sendTokensDialog.form.memo ? this.sendTokensDialog.form.memo : '',
          []
        )
          .then(() => {
            this.$notifier.showSuccess('Transfer was successfull');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Transaction was failed');
          })
          .finally(() => {
            this.sendTokensDialog.isSending = false;
            this.sendTokensDialog.isOpened = false;
            return this.updateBalances();
          });
      },
      creditInfoChanged(values) {
        for (const key in values) {
          this.depositDialog.cardData[key] = values[key];
        }
      }
    }
  };
</script>

<style lang="less" scoped>
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
</style>
