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
      @click="openTransferDialog(transfer)"
    >
      <v-icon left>
        mdi-bank-transfer
      </v-icon>
      Transfer
    </v-btn>
    <d-dialog
      v-model="transferDialog.isOpened"
      :disabled="transferDialog.isSending"
      :loading="transferDialog.isSending"
      title="Transfer asset"
      max-width="570px"
      :confirm-button-title="$t('userWallet.sendResearchTokensDialog.submitBtn')"
      :cancel-button-title="$t('userWallet.cancel')"
      @click:confirm="sendTokens"
    >
      <v-form
        ref="sendResearchTokensForm"
        v-model="transferDialog.form.valid"
      >
        <v-select
          v-model="transferDialog.form.account"
          label="Asset"
          :items="transfer.balances"
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
                {{ $$fromAssetUnits(item.amount).amount | currency('') }}
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="d-flex justify-space-between w-100">
              <div>
                {{ item.asset_symbol }}
              </div>
              <div>
                {{ $$fromAssetUnits(item.amount).amount | currency('') }}
              </div>
            </div>
          </template>
        </v-select>
        <v-text-field
          v-model.number="transferDialog.form.amount"
          label="Amount"
          :rules="transferDialog.form.rules.amount"
          outlined
        />
        <v-autocomplete
          v-model="transferDialog.form.receiver"
          :items="allAccounts"
          :rules="transferDialog.form.rules.username"
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
        <v-textarea
          v-model="transferDialog.form.memo"
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
  import { mapActions } from 'vuex';

  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';

  const assetsService = AssetsService.getInstance();

  export default {
    name: 'TransferAction',

    components: {
      DDialog,
      DBoxItem
    },

    mixins: [assetsChore],

    props: {
      allAccounts: {
        type: Array,
        default: () => []
      },
      transfer: {
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
        transferDialog: {
          form: {
            receiver: {},
            amount: 0,
            valid: false,
            memo: '',
            account: {},
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

    methods: {
      ...mapActions({
        loadUserBalances: 'auth/loadBalances'
      }),
      openTransferDialog(item) {
        this.transferDialog.isOpened = true;

        this.transferDialog.form.valid = false;
        this.transferDialog.form.amount = '';
        this.transferDialog.form.account = item;
      },

      sendTokens() {
        if (this.transferDialog.form.valid) {
          this.transferDialog.isSending = true;

          let amount = '0';

          if (this.transfer.type === 'currency') {
            amount = this.toAssetUnits(
              this.transferDialog.form.amount,
              this.$$assetInfo(this.transferDialog.form.account.asset_symbol).precision,
              this.$$assetInfo(this.transferDialog.form.account.asset_symbol).string_symbol
            );
          }
          if (this.transfer.type === 'share') {
            amount = `${this.transferDialog.form.amount} ${this.transferDialog.form.account.asset_symbol}`;
          }

          return assetsService.transferAsset(
            {
              privKey: this.$currentUser.privKey,
              username: this.transferDialog.form.account.owner
            },
            {
              from: this.transferDialog.form.account.owner,
              to: this.transferDialog.form.receiver.account.name,
              amount,
              memo: this.transferDialog.form.memo ? this.transferDialog.form.memo : '',
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
              this.transferDialog.isSending = false;
              this.transferDialog.isOpened = false;
              if (this.transfer.type === 'currency') {
                this.updateBalances();
              }
              if (this.transfer.type === 'share') {
                this.$store.dispatch('Wallet/loadBalances', this.$route.params.account);
              }
            });
        }
        return false;
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
