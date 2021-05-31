<template>
  <div>
    <v-data-table
      :items="accountData.balances"
      :headers="tableHeaders"
      disable-sort
      :hide-default-footer="true"
    >
      <template #item.amountAsset="{ item }">
        <v-chip
          outlined
        >
          {{ $$fromAssetUnits(item.amount).assetId }}
        </v-chip>
      </template>

      <template #item.amountValue="{ item }">
        {{ $$toAssetUnits($$fromAssetUnits(item.amount), true, {symbol: ''}) }}
      </template>

      <template #item.actions="{ item }">
        <deposit-funds-action :account="item.owner" :assetId="item.assetSymbol" class="mr-4" />
        <transfer-action
          :all-accounts="allAccounts"
          :asset="{
            ...item, balances: accountData.balances, type: 'currency'
          }"
          :disabled="!isTransferAvailable"
        />
      </template>
      <template #item.actionMenu="{ item }">
        <v-menu
          v-if="isDepositAvailable(item.assetSymbol)
            || isWithdrawAvailable(item.assetSymbol)"
          bottom
          left
          offset-y
        >
          <template #activator="{ on }">
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
            <!-- <v-list-item
              v-if="isDepositAvailable(item.assetSymbol)"
              @click="openDepositDialog(item)"
            >
              <v-list-item-title>{{ $t('wallet.deposit') }}</v-list-item-title>
            </v-list-item> -->
            <v-list-item
              v-if="isWithdrawAvailable(item.assetSymbol)"
              @click="openWithdrawDialog(item)"
            >
              <v-list-item-title>{{ $t('wallet.withdraw') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <vex-dialog
      v-model="depositDialog.isOpened"
      max-width="800px"
      :title="$t('wallet.depositDialog.depositFunds')"
      :disabled="depositDialog.isDepositing || isDepositingDisabled"
      :loading="depositDialog.isDepositing"
      :button-true-text="$t('wallet.depositDialog.depositFunds')"
      :button-false-text="$t('wallet.cancel')"
      @click:confirm="deposit()"
    >
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
            <div>
              <label class="text-body-2">
                {{ $t('wallet.depositDialog.amountField.label') }}
              </label>
              <v-text-field
                v-model="depositDialog.amount"
                outlined
                :placehoder="$t('wallet.depositDialog.amountField.placeholder')"
              />
            </div>
            <div class="my-4">
              <v-checkbox
                v-model="depositDialog.termsConfirmed"
                :label="$t('wallet.depositDialog.confirmQualifiedField')"
                hide-details
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </vex-dialog>
    <vex-dialog
      v-model="withdrawDialog.isOpened"
      max-width="800px"
      :title="$t('wallet.withdrawDialog.withdrawFunds')"
      :disabled="withdrawDialog.isWithdrawing || isWithdrawDisabled"
      :loading="withdrawDialog.isWithdrawing"
      :button-true-text="$t('wallet.withdrawDialog.withdrawFunds')"
      :button-false-text="$t('wallet.cancel')"
      @click:confirm="withdraw()"
    >
      <v-row>
        <v-col cols="6" class="pr-12" style="border-right: 2px solid #E0E0E0">
          <div class="mx-4 mt-2">
            <label class="text-body-2">{{ $t('wallet.withdrawDialog.nameField') }}</label>
            <v-text-field
              v-model="withdrawDialog.name"
              outlined
            />
          </div>
          <div class="mx-4 mt-4">
            <label class="text-body-2">
              {{ $t('wallet.withdrawDialog.idanField.label') }}
              <v-tooltip right>
                <template #activator="{ on }">
                  <v-icon small v-on="on">help</v-icon>
                </template>

                <span>{{ $t('wallet.withdrawDialog.idanField.tooltip') }}</span>
              </v-tooltip>
            </label>
            <v-text-field
              v-model="withdrawDialog.iban"
              outlined
              counter="34"
            />
          </div>
          <div class="mx-4 mt-4">
            <label class="text-body-2">
              {{ $t('wallet.withdrawDialog.referenceField.label') }}
              <v-tooltip right>
                <template #activator="{ on }">
                  <v-icon small v-on="on">help</v-icon>
                </template>

                <span>{{ $t('wallet.withdrawDialog.referenceField.tooltip') }}</span>
              </v-tooltip>
            </label>
            <v-text-field
              v-model="withdrawDialog.refNum"
              outlined
            />
          </div>
          <div class="mx-4 mt-4">
            <label class="text-body-2">
              {{ $t('wallet.withdrawDialog.beneficiaryField') }}
            </label>
            <v-textarea
              v-model="withdrawDialog.messageText"
              outlined
              rows="9"
              no-resize
            />
          </div>
        </v-col>
        <v-col cols="6" class="pl-4">
          <div class="display-flex flex-column justify-end pl-12 pr-4 fill-height">
            <div>
              <label class="text-body-2">{{ $t('wallet.withdrawDialog.amountField') }}</label>
              <v-text-field
                v-model="withdrawDialog.amount"
                outlined
              />
            </div>
            <div class="my-4">
              <v-checkbox
                v-model="withdrawDialog.termsConfirmed"
                :label="$t('wallet.withdrawDialog.confirmQualifiedField')"
                hide-details
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </vex-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import TransferAction from '@/components/Wallet/components/TransferAction';
  import DepositFundsAction from '@/components/Wallet/components/DepositFundsAction';
  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';
  import VCreditCard from 'v-credit-card';

  const assetsService = AssetsService.getInstance();
  const fiatAssetBackedTokens = ['EUR', 'USD'];

  export default {
    name: 'CurrenciesInfoTable',

    components: {
      DepositFundsAction,
      TransferAction,
      VCreditCard
    },

    mixins: [assetsChore],

    props: {
      allAccounts: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        translations: {
          name: {
            label: this.$t('wallet.translations.name.label'),
            placeholder: this.$t('wallet.translations.name.placeholder')
          },
          card: {
            label: this.$t('wallet.translations.card.label'),
            placeholder: this.$t('wallet.translations.card.placeholder')
          },
          expiration: {
            label: this.$t('wallet.translations.expiration.label')
          },
          security: {
            label: this.$t('wallet.translations.security.label'),
            placeholder: this.$t('wallet.translations.security.placeholder')
          }
        },
        tableHeaders: [
          {
            text: this.$t('wallet.asset'),
            value: 'amountAsset'
          },
          {
            text: this.$t('wallet.amount'),
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
        withdrawDialog: {
          amount: 0,
          precision: 0,
          stringAmount: '',
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
        if (this.withdrawDialog.amount > this.$$fromAssetUnits(this.withdrawDialog.stringAmount).amount) {
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
        loadUserBalances: 'auth/loadBalances'
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
      openDepositDialog(item) {
        this.depositDialog.owner = item.owner;
        this.depositDialog.amount = 0;
        this.depositDialog.precision = this.$$assetInfo(item.assetSymbol).precision;
        this.depositDialog.selectedCurrency = item.assetSymbol;
        this.depositDialog.cardData.name = '';
        this.depositDialog.cardData.cardNumber = '';
        this.depositDialog.cardData.expiration = '';
        this.depositDialog.cardData.security = '';
        this.depositDialog.termsConfirmed = false;
        this.depositDialog.isOpened = true;
      },
      isDepositAvailable(assetId) {
        const symbol = this.assetsInfo[assetId] ? this.assetsInfo[assetId].stringSymbol : '';
        return this.$hasModule(
          this.DEIP_MODULE.APP_ASSETS_DEPOSIT
        ) && fiatAssetBackedTokens.some((s) => s == symbol);
      },
      isWithdrawAvailable(assetId) {
        const symbol = this.assetsInfo[assetId] ? this.assetsInfo[assetId].stringSymbol : '';
        return this.$hasModule(
          this.DEIP_MODULE.APP_ASSETS_WITHDRAWAL
        ) && fiatAssetBackedTokens.some((s) => s == symbol);
      },
      openWithdrawDialog(item) {
        this.depositDialog.owner = item.owner;
        this.withdrawDialog.amount = 0;
        this.withdrawDialog.stringAmount = item.amount;
        this.withdrawDialog.precision = this.$$assetInfo(item.assetSymbol).precision;
        this.withdrawDialog.selectedCurrency = item.assetSymbol;
        this.withdrawDialog.name = '';
        this.withdrawDialog.iban = '';
        this.withdrawDialog.refNum = '';
        this.withdrawDialog.messageText = '';
        this.withdrawDialog.termsConfirmed = false;
        this.withdrawDialog.isOpened = true;
      },
      withdraw() {
        this.withdrawDialog.isWithdrawing = true;
        return assetsService.transferAssets(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.username },
          false,
          {
            from: this.depositDialog.owner,
            to: 'kim',
            amount: this.toAssetUnits(this.withdrawDialog.amount, this.withdrawDialog.precision, this.withdrawDialog.selectedCurrency),
            memo: this.$t('wallet.depositDialog.withdrawFor', { owner: this.depositDialog.owner }),
            extensions: []
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('wallet.depositDialog.withdrawnSucc'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('wallet.transFail'));
          })
          .finally(() => {
            this.withdrawDialog.isWithdrawing = false;
            this.withdrawDialog.isOpened = false;
            return this.updateBalances();
          });
      },
      deposit() {
        this.depositDialog.isDepositing = true;
        return assetsService.transferAssets(
          { privKey: '5JBUoX9L6fjHmfwtK2S8ksEevmM3q6LzYncsdeoax5V662PehFa', username: 'kim' },
          false,
          {
            from: 'kim',
            to: this.depositDialog.owner,
            amount: this.toAssetUnits(this.depositDialog.amount, this.depositDialog.precision, this.depositDialog.selectedCurrency),
            memo: this.$t('wallet.depositDialog.depositFor', { owner: this.depositDialog.owner }),
            extensions: []
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('wallet.depositDialog.depositSucc'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('wallet.transFail'));
          })
          .finally(() => {
            this.depositDialog.isDepositing = false;
            this.depositDialog.isOpened = false;
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
