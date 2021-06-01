<template>
  <div>
    <v-btn
      outlined
      small
      max-height="30"
      class="text-caption"
      color="primary"
      :disabled="disabled"
      @click="opendialog(asset)"
    >
      <v-icon left>
        mdi-bank-transfer
      </v-icon>
      {{ $t('wallet.transferAction.transfer') }}
    </v-btn>
    <v-btn
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
      {{ $t('wallet.transferAction.exchange') }}
    </v-btn>
    <vex-dialog
      v-model="dialog.isOpened"
      :disabled="dialog.isSending"
      :true-disabled="isDisabled"
      :loading="dialog.isSending"
      :button-true-props="{ text: true, color: 'primary', loading: dialog.isSending }"
      :title="dialog.title"
      max-width="570px"
      :button-true-text="
        dialog.exchange ?
          $t('wallet.transferAction.exchange')
          : $t('wallet.transferAction.transfer')
      "
      :button-false-text="$t('wallet.cancel')"
      @click:confirm="dialog.exchange ? doExchange() : sendTokens()"
    >
      <v-form
        ref="sendResearchTokensForm"
        v-model="dialog.form.valid"
      >
        <v-select
          v-model="dialog.form.fromAccount"
          :label="dialog.exchange ?
            $t('wallet.transferAction.fromAsset')
            : $t('wallet.transferAction.asset')"
          :items="[...balances, ...accountData.balances]"
          outlined
          return-object
          item-text="amount"
          item-value="assetSymbol"
          :menu-props="{
            maxWidth: 525
          }"
        >
          <template #selection="{ item }">
            <div class="d-flex justify-space-between w-100 align-center">
              <div>
                {{ item.assetSymbol }}
              </div>
              <div class="text--secondary">
                {{
                  $$toAssetUnits(item.amount, true, {
                    symbol: '', fractionCount: $$fromAssetUnits(item.amount).precision
                  })
                }} {{ $t('wallet.transferAction.available') }}
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="d-flex justify-space-between w-100">
              <div>
                {{ item.assetSymbol }}
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
          :label="$t('wallet.transferAction.amount')"
          :rules="dialog.form.rules.amount"
          outlined
        />
        <template v-if="dialog.exchange">
          <v-select
            v-model="dialog.form.toAccount"
            :label="$t('wallet.transferAction.toAsset')"
            :items="exchangeToAccounts"
            outlined
            return-object
            item-text="stringSymbol"
            item-value="stringSymbol"
            :menu-props="{
              maxWidth: 525
            }"
            @change="getAccountsByAsset"
          />
          <v-text-field
            v-model="dialog.form.toAmount"
            :label="$t('wallet.transferAction.amount')"
            :rules="dialog.form.rules.amount"
            outlined
          />
        </template>
        <v-autocomplete
          v-model="dialog.form.receiver"
          :items="accountsList"
          :rules="dialog.form.rules.username"
          append-icon="search"
          :loading="loadingAccounts"
          :menu-props="{
            maxWidth: 525
          }"
          :label="dialog.exchange ?
            $t('wallet.transferAction.exchangeRecipient')
            : $t('wallet.transferAction.recipient')"
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
          :label="$t('wallet.transferAction.reqExpDate')"
          class="mb-4"
          only-future
        />
        <v-textarea
          v-model="dialog.form.memo"
          outlined
          label="Notes"
          no-resize
          rows="8"
        />
      </v-form>
    </vex-dialog>
  </div>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';
  import { UsersService } from '@deip/users-service';
  import { ResearchGroupService } from '@deip/research-group-service';

  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';
  import { mapGetters } from 'vuex';

  const researchGroupService = ResearchGroupService.getInstance();
  const usersService = UsersService.getInstance();
  const assetsService = AssetsService.getInstance();

  export default {
    name: 'TransferAction',

    components: {
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
            return this.$t('wallet.transferAction.receiverRequired');
          }

          if (value === this.$currentUser.username) {
            return this.$t('wallet.transferAction.otherName');
          }

          return true;
        }
      };
      return {
        loadingAccounts: false,
        exchangeAccounts: [],
        dialog: {
          exchange: false,
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
                  if (isNaN(value)) return this.$t('wallet.transferAction.flNumber');
                  if (!value || value < 0) return this.$t('wallet.transferAction.posFlNumber');

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
      ...mapGetters({
        balances: 'Wallet/balances',
        groupData: 'Wallet/groupData',
        allAssets: 'auth/allAssets'
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
      exchangeToAccounts() {
        if (this.dialog.exchange) {
          return this.allAssets.filter(
            (item) => item.stringSymbol !== this.dialog.form.fromAccount.assetSymbol
              && item.stringSymbol !== this.$env.ASSET_UNIT
          );
        }
        return [];
      },
      accountsList() {
        if (this.dialog.exchange) {
          return this.exchangeAccounts;
        }
        return this.allAccounts;
      },
      isDisabled() {
        if (this.dialog.form.fromAccount.amount) {
          const { amount } = this.$$fromAssetUnits(this.dialog.form.fromAccount.amount);
          return !amount || amount < this.dialog.form.fromAmount;
        }
        return true;
      }
    },

    methods: {
      getAccountsByAsset($event) {
        this.loadingAccounts = true;
        this.exchangeAccounts = [];
        const blackList = [...this.SYSTEM_USERS, this.$currentUser.username];
        assetsService.getAccountsAssetBalancesByAsset($event.stringSymbol)
          .then((accounts) => usersService.getUsers(
            accounts.map(({ owner }) => owner).filter((owner) => !blackList.some(u => u == owner))
          ))
          .then((accounts) => {
            const usersAccounts = [];
            const groupsAccount = [];
            accounts.forEach((a) => {
              if (a.account.is_research_group) {
                groupsAccount.push(a);
              } else {
                usersAccounts.push(a);
              }
            });
            this.exchangeAccounts.push(...usersAccounts.map((a) => ({
              ...a,
              fullName: this.$options.filters.accountFullname(a)
            })));
            return Promise.all(
              groupsAccount.map((g) => researchGroupService.getResearchGroup(g.account.name))
            );
          })
          .then((groupAccounts) => {
            this.exchangeAccounts.push(...groupAccounts.map((g) => ({
              ...g,
              fullName: g.name
            })));
          })
          .finally(() => { this.loadingAccounts = false; });
      },
      opendialog(item, exchange = false) {
        this.dialog.exchange = exchange;
        this.dialog.isOpened = true;
        if (exchange) {
          this.dialog.title = this.$t('wallet.transferAction.exchnageAsset');
          this.dialog.form.toAmount = '';
        } else {
          this.dialog.title = this.$t('wallet.transferAction.transferAsset');
        }

        if (this.$refs.sendResearchTokensForm) this.$refs.sendResearchTokensForm.reset();
        this.dialog.form.fromAccount = item;
      },

      sendTokens() {
        if (this.dialog.form.valid) {
          this.dialog.isSending = true;

          let fromAmount = '0';

          const fromAccountData = this.$$assetInfo(this.dialog.form.fromAccount.assetSymbol);

          fromAmount = this.$$toAssetUnits(
            this.dialog.form.fromAmount,
            false,
            { symbol: fromAccountData.stringSymbol, fractionCount: fromAccountData.precision }
          );

          const isProposal = this.$currentUser.username !== this.dialog.form.fromAccount.owner;

          return assetsService.transferAssets(
            {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
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
              this.$notifier.showSuccess(this.$t('wallet.transferAction.succTokSent'));
            })
            .catch((err) => {
              this.$notifier.showError(this.$t('wallet.transFail'));
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

          const fromAccountData = this.$$assetInfo(this.dialog.form.fromAccount.assetSymbol);
          const toAccountData = this.$$assetInfo(this.dialog.form.toAccount.stringSymbol);
          fromAmount = this.$$toAssetUnits(
            this.dialog.form.fromAmount,
            false,
            { symbol: fromAccountData.stringSymbol, fractionCount: fromAccountData.precision }
          );
          toAmount = this.$$toAssetUnits(
            this.dialog.form.toAmount,
            false,
            { symbol: toAccountData.stringSymbol, fractionCount: toAccountData.precision }
          );

          assetsService.createAssetsExchangeProposal({
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          }, {
            party1: this.dialog.form.fromAccount.owner,
            party2: this.dialog.form.receiver.account.name,
            asset1: fromAmount,
            asset2: toAmount,
            memo: this.dialog.form.memo,
            extensions: []
          })
            .then(() => {
              this.$notifier.showSuccess(this.$t('wallet.transferAction.succExcSent'));
            })
            .catch((err) => {
              this.$notifier.showError(this.$t('wallet.transFail'));
              console.error(err);
            })
            .finally(() => {
              this.dialog.isSending = false;
              this.dialog.isOpened = false;
              Promise.all([
                this.updateBalances(),
                this.$store.dispatch('Wallet/loadBalances', this.$route.params.account)
              ]);
            });
        }
      },
      updateBalances() {
        if (this.$route.name === 'userWallet') {
          this.$store.dispatch('Assets/getCurrentUserBalances', this.$currentUser.username, { root: true });
        } else if (this.$route.name === 'groupWallet') {
          this.$store.dispatch('Wallet/loadBalanceData', this.$route.params.account)
            .then(() => { this.$setReady(); });
        }
      }
    }
  };
</script>
