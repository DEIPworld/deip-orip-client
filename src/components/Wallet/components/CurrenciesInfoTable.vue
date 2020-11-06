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
            {{ assetsIcons[$$fromAssetUnits(item.amount).assetId] || assetsIcons.default }}
          </v-icon>
          {{ $$fromAssetUnits(item.amount).assetId }}
        </v-chip>
      </template>

      <template v-slot:item.amountValue="{ item }">
        <span class="text-body-2">
          {{ $$toAssetUnits($$fromAssetUnits(item.amount), true, {symbol: ''}) }}<br>
        </span>
      </template>

      <template v-slot:item.actions="{ item }">
        <transfer-action
          :all-accounts="allAccounts"
          :transfer="{
            ...item, balances: accountData.balances, type: 'currency'
          }"
          :disabled="!isTransferAvailable"
        />
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
              @click="openDepositDialog(item)"
            >
              <v-list-item-title>{{ $t('userWallet.deposit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="isWithdrawAvailable(item.asset_id)"
              @click="openWithdrawDialog(item)"
            >
              <v-list-item-title>{{ $t('userWallet.withdraw') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <d-dialog
      v-model="depositDialog.isOpened"
      max-width="800px"
      :title="$t('userWallet.depositDialog.depositFunds')"
      :disabled="depositDialog.isDepositing"
      :loading="depositDialog.isDepositing"
      :confirm-button-title="$t('userWallet.depositDialog.depositFunds')"
      :cancel-button-title="$t('userWallet.cancel')"
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
                {{ $t('userWallet.depositDialog.amountField.label') }}
              </label>
              <v-text-field
                v-model="depositDialog.amount"
                outlined
                :placehoder="$t('userWallet.depositDialog.amountField.placeholder')"
              />
            </div>
            <div class="my-4">
              <v-checkbox
                v-model="depositDialog.termsConfirmed"
                :label="$t('userWallet.depositDialog.confirmQualifiedField')"
                hide-details
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </d-dialog>
    <d-dialog
      v-model="withdrawDialog.isOpened"
      max-width="800px"
      :title="$t('userWallet.withdrawDialog.withdrawFunds')"
      :disabled="withdrawDialog.isWithdrawing"
      :loading="withdrawDialog.isWithdrawing"
      :confirm-button-title="$t('userWallet.withdrawDialog.withdrawFunds')"
      :cancel-button-title="$t('userWallet.cancel')"
      @click:confirm="withdraw()"
    >
      <v-row>
        <v-col cols="6" class="pr-12" style="border-right: 2px solid #E0E0E0">
          <div class="mx-4 mt-2">
            <label class="text-body-2">{{ $t('userWallet.withdrawDialog.nameField') }}</label>
            <v-text-field
              v-model="withdrawDialog.name"
              outlined
            />
          </div>
          <div class="mx-4 mt-4">
            <label class="text-body-2">
              {{ $t('userWallet.withdrawDialog.idanField.label') }}
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">help</v-icon>
                </template>

                <span>{{ $t('userWallet.withdrawDialog.idanField.tooltip') }}</span>
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
              {{ $t('userWallet.withdrawDialog.referenceField.label') }}
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">help</v-icon>
                </template>

                <span>{{ $t('userWallet.withdrawDialog.referenceField.tooltip') }}</span>
              </v-tooltip>
            </label>
            <v-text-field
              v-model="withdrawDialog.refNum"
              outlined
            />
          </div>
          <div class="mx-4 mt-4">
            <label class="text-body-2">
              {{ $t('userWallet.withdrawDialog.beneficiaryField') }}
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
              <label class="text-body-2">{{ $t('userWallet.withdrawDialog.amountField') }}</label>
              <v-text-field
                v-model="withdrawDialog.amount"
                outlined
              />
            </div>
            <div class="my-4">
              <v-checkbox
                v-model="withdrawDialog.termsConfirmed"
                :label="$t('userWallet.withdrawDialog.confirmQualifiedField')"
                hide-details
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </d-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import TransferAction from '@/components/Wallet/components/TransferAction';
  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';

  const assetsService = AssetsService.getInstance();
  const fiatAssetBackedTokens = ['EUR', 'USD'];

  export default {
    name: 'CurrenciesInfoTable',

    components: {
      DDialog,
      DBoxItem,
      TransferAction
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
      getAvailableCurrencyAmount(balance) {
        return this.fromAssetsToFloat(balance);
      },
      openDepositDialog(item) {
        this.depositDialog.owner = item.owner;
        this.depositDialog.amount = 0;
        this.depositDialog.precision = this.assetsInfo[item.asset_id].precision;
        this.depositDialog.selectedCurrency = this.assetsInfo[item.asset_id].string_symbol;
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
      openWithdrawDialog(item) {
        this.depositDialog.owner = item.owner;
        this.withdrawDialog.amount = 0;
        this.withdrawDialog.precision = this.assetsInfo[item.asset_id].precision;
        this.withdrawDialog.selectedCurrency = this.assetsInfo[item.asset_id].string_symbol;
        this.withdrawDialog.name = '';
        this.withdrawDialog.iban = '';
        this.withdrawDialog.refNum = '';
        this.withdrawDialog.messageText = '';
        this.withdrawDialog.termsConfirmed = false;
        this.withdrawDialog.isOpened = true;
      },
      withdraw() {
        this.withdrawDialog.isWithdrawing = true;
        return assetsService.transferAsset(
          { privKey: this.$currentUser.privKey, username: this.depositDialog.owner },
          {
            from: this.depositDialog.owner,
            to: 'kim',
            amount: this.toAssetUnits(this.withdrawDialog.amount, this.withdrawDialog.precision, this.withdrawDialog.selectedCurrency),
            memo: `withdraw for ${this.depositDialog.owner}`,
            extensions: []
          } 
        )
          .then(() => {
            this.$notifier.showSuccess('Funds have been withdrawn successfully!');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Transaction was failed');
          })
          .finally(() => {
            this.withdrawDialog.isWithdrawing = false;
            this.withdrawDialog.isOpened = false;
            return this.updateBalances();
          });
      },
      deposit() {
        this.depositDialog.isDepositing = true;
        return assetsService.transferAsset(
          { privKey: '5JBUoX9L6fjHmfwtK2S8ksEevmM3q6LzYncsdeoax5V662PehFa', username: 'kim' },
          {
            from: "kim", 
            to: this.depositDialog.owner,
            amount:  this.toAssetUnits(this.depositDialog.amount, this.depositDialog.precision, this.depositDialog.selectedCurrency),
            memo: `deposit for ${this.depositDialog.owner}`,
            extensions: []
          }
        )
          .then(() => {
            this.$notifier.showSuccess('Funds have been deposited successfully!');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Transaction was failed');
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
