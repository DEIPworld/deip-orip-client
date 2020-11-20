<template>
  <div>
    <v-btn
      outlined
      small
      max-height="30"
      max-width="95"
      class="text-caption"
      color="primary"
      :disabled="disabled"
      @click="opendialog(asset)"
    >
      <v-icon left>
        mdi-bank-transfer
      </v-icon>
      Transfer
    </v-btn>
    <!-- <v-btn
      outlined
      small
      max-height="30"
      class="text-caption ml-4"
      color="primary"
      @click="opendialog(asset, true)"
    >
      <v-icon left>
        payments
      </v-icon>
      Exchange
    </v-btn> -->
    <d-dialog
      v-model="dialog.isOpened"
      :disabled="dialog.isSending"
      :loading="dialog.isSending"
      :title="dialog.title"
      max-width="570px"
      :confirm-button-title="
        dialog.exchange ? 'Sell' : $t('userWallet.sendResearchTokensDialog.submitBtn')
      "
      :cancel-button-title="$t('userWallet.cancel')"
      @click:confirm="dialog.exchange ? doExchange() : sendTokens()"
    >
      <v-form
        ref="sendResearchTokensForm"
        v-model="dialog.form.valid"
      >
        <v-select
          v-model="dialog.form.fromAccount"
          :label="dialog.exchange ? 'From asset' : 'Asset'"
          :items="asset.balances"
          outlined
          return-object
          item-text="amount"
          item-value="asset_symbol"
          :menu-props="{
            maxWidth: 525
          }"
        >
          <template #selection="{ item }">
            <div class="d-flex justify-space-between w-100 align-center">
              <div>
                {{ item.asset_symbol }}
              </div>
              <div>
                {{
                  $$toAssetUnits(item.amount, true, {
                    symbol: '', fractionCount: $$fromAssetUnits(item.amount).precision
                  })
                }}
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="d-flex justify-space-between w-100">
              <div>
                {{ item.asset_symbol }}
              </div>
              <div>
                {{
                  $$toAssetUnits(item.amount, true, {
                    symbol: '', fractionCount: $$fromAssetUnits(item.amount).precision
                  })
                }}
              </div>
            </div>
          </template>
        </v-select>
        <v-text-field
          v-model="dialog.form.fromAmount"
          label="Amount"
          :rules="dialog.form.rules.amount"
          outlined
        />
        <template v-if="dialog.exchange">
          <v-select
            v-model="dialog.form.toAccount"
            label="To asset"
            :items="exchangeToAccounts"
            outlined
            return-object
            item-text="amount"
            item-value="asset_symbol"
            :menu-props="{
              maxWidth: 525
            }"
          >
            <template #selection="{ item }">
              <div class="d-flex justify-space-between w-100 align-center">
                <div>
                  {{ item.asset_symbol }}
                </div>
                <div>
                  {{
                    $$toAssetUnits(item.amount, true, {
                      symbol: '', fractionCount: $$fromAssetUnits(item.amount).precision
                    })
                  }}
                </div>
              </div>
            </template>
            <template #item="{ item }">
              <div class="d-flex justify-space-between w-100">
                <div>
                  {{ item.asset_symbol }}
                </div>
                <div>
                  {{
                    $$toAssetUnits(item.amount, true, {
                      symbol: '', fractionCount: $$fromAssetUnits(item.amount).precision
                    })
                  }}
                </div>
              </div>
            </template>
          </v-select>
          <v-text-field
            v-model="dialog.form.toAmount"
            label="Amount"
            :rules="dialog.form.rules.amount"
            outlined
          />
        </template>
        <v-autocomplete
          v-model="dialog.form.receiver"
          :items="allAccounts"
          :rules="dialog.form.rules.username"
          append-icon="search"
          :menu-props="{
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
                    48,
                    48
                  ) : $options.filters.avatarSrc(
                    item.profile,
                    48,
                    48,
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
                    48,
                    48
                  ) : $options.filters.avatarSrc(
                    item.profile,
                    48,
                    48,
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
        <d-date-time-input
          v-if="dialog.exchange"
          v-model="dialog.form.date"
          label="Request expiration date"
          class="mb-4"
        />
        <v-textarea
          v-model="dialog.form.memo"
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
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';

  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';

  const assetsService = AssetsService.getInstance();

  export default {
    name: 'TransferAction',

    components: {
      DDialog,
      DBoxItem,
      DDateTimeInput
    },

    mixins: [assetsChore],

    props: {
      allAccounts: {
        type: Array,
        default: () => []
      },
      asset: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean,
        default: false
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
        dialog: {
          title: '',
          form: {
            receiver: {},
            fromAmount: '',
            toAmount: '',
            valid: false,
            memo: '',
            date: '',
            fromAccount: {},
            toAccount: {},
            rules: {
              username: [rules.username],
              amount: [
                (value) => {
                  if (isNaN(value)) return 'Should be valid float number';
                  if (!value || value < 0) return 'Should be valid positive float number';

                  return true;
                }
              ]
            }
          },
          isOpened: false,
          isSending: false
        }
      };
    },

    computed: {
      exchangeToAccounts() {
        if (this.dialog.exchange) {
          return this.asset.balances.filter(
            (item) => item.asset_symbol !== this.dialog.form.fromAccount.asset_symbol
          );
        }
        return [];
      }
    },

    methods: {
      opendialog(item, exchange = false) {
        this.dialog.exchange = exchange;
        this.dialog.isOpened = true;
        if (exchange) {
          this.dialog.title = 'Exchnage asset';
          this.dialog.form.toAmount = '';
        } else {
          this.dialog.title = 'Transfer asset';
        }

        this.dialog.form.memo = '';
        this.dialog.form.receiver = {};
        this.dialog.form.valid = false;
        this.dialog.form.fromAmount = '';
        this.dialog.form.fromAccount = item;
      },

      sendTokens() {
        if (this.dialog.form.valid) {
          this.dialog.isSending = true;

          let fromAmount = '0';

          if (this.asset.type === 'currency') {
            const fromAccountData = this.$$assetInfo(this.dialog.form.fromAccount.asset_symbol);
            fromAmount = this.$$toAssetUnits(
              this.dialog.form.fromAmount,
              false,
              { symbol: fromAccountData.string_symbol, fractionCount: fromAccountData.precision }
            );
          }
          if (this.asset.type === 'share') {
            fromAmount = `${this.dialog.form.fromAmount} ${this.dialog.form.fromAccount.asset_symbol}`;
          }
          
          const isProposal = this.$currentUserName != this.dialog.form.fromAccount.owner;
          return assetsService.transferAssets(
            {
              privKey: this.$currentUser.privKey,
              username: this.dialog.form.fromAccount.owner
            },
            isProposal,
            {
              from: this.dialog.form.fromAccount.owner,
              to: this.dialog.form.receiver.account.name,
              amount: fromAmount,
              memo: this.dialog.form.memo,
              extensions: []
            }
          )
            .then(() => {
              this.$notifier.showSuccess('Ttokens successfully sent');
            })
            .catch((err) => {
              this.$notifier.showError('Transaction was failed');
              console.error(err);
            })
            .finally(() => {
              this.dialog.isSending = false;
              this.dialog.isOpened = false;
              if (this.asset.type === 'currency') {
                this.updateBalances();
              }
              if (this.asset.type === 'share') {
                this.$store.dispatch('Wallet/loadBalances', this.$route.params.account);
              }
            });
        }
        return false;
      },
      doExchange() {
        if (this.dialog.form.valid) {
          this.dialog.isSending = true;

          let fromAmount = '0';
          let toAmount = '0';

          if (this.asset.type === 'currency') {
            const fromAccountData = this.$$assetInfo(this.dialog.form.fromAccount.asset_symbol);
            const toAccountData = this.$$assetInfo(this.dialog.form.toAccount.asset_symbol);
            fromAmount = this.$$toAssetUnits(
              this.dialog.form.fromAmount,
              false,
              { symbol: fromAccountData.string_symbol, fractionCount: fromAccountData.precision }
            );
            toAmount = this.$$toAssetUnits(
              this.dialog.form.toAmount,
              false,
              { symbol: toAccountData.string_symbol, fractionCount: toAccountData.precision }
            );
          }
          if (this.asset.type === 'share') {
            fromAmount = `${this.dialog.form.fromAmount} ${this.dialog.form.fromAccount.asset_symbol}`;
            toAmount = `${this.dialog.form.toAmount} ${this.dialog.form.toAccount.asset_symbol}`;
          }
          console.log(fromAmount);
          console.log(toAmount);

          this.dialog.isSending = false;
          this.dialog.isOpened = false;
        }
      },
      updateBalances() {
        if (this.$route.name === 'userWallet') {
          this.$store.dispatch('auth/loadBalances');
        } else if (this.$route.name === 'groupWallet') {
          this.$store.dispatch('Wallet/loadBalanceData', this.$route.params.account)
            .then(() => { this.$setReady(); });
        }
      }
    }
  };
</script>
