<template>
  <v-skeleton-loader
    type="table-thead, table-tbody"
    :loading="!$ready"
  >
    <v-data-table
      :headers="tableHeader"
      :items="balances"
      :hide-default-footer="balances.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
      item-key="security_token_external_id"
      disable-sort
      show-expand
      :expanded.sync="expanded"
    >
      <template #item.research.title="{ item }">
        <span class="text-body-1">{{ item.research.title }}</span>
      </template>
      <template #item.myShare.amount="{ item }">
        <div class="text-body-1">
          {{ item.amount }}
        </div>
        <div class="text-body-2 text--secondary">
          {{ sharePercent(item) }} %
        </div>
      </template>
      <template #item.group.account.balances="{ item }">
        <span class="text-body-1">
          {{ toAsset(tokensPrice(item)) }}
        </span>
      </template>
      <template #item.revenueHistory="{ item }">
        <div class="text-body-1 mt-4">
          {{ toAsset(totalRevenue(item.revenueHistory)) }}
        </div>
        <div class="text-body-2 text--secondary mb-4">
          {{ toAsset(revenuePerToken(item)) }} per token
        </div>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          outlined
          small
          max-height="30"
          max-width="95"
          class="text-caption"
          color="primary"
          @click="openSendResearchTokensDialog(item)"
        >
          <v-icon left>
            mdi-bank-transfer
          </v-icon>
          Transfer
        </v-btn>
      </template>
      <template #expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0">
          <div class="font-weight-bold mt-4">
            Revenue per token
          </div>
          <d-chart-column
            v-if="item.revenueHistoryChartData.length"
            :data="[['Date', 'Revenue'], ...item.revenueHistoryChartData]"
            :options="{
              chartArea: {width: '100%'},
              vAxis: {format: '##$'},
              legend: 'none'
            }"
          />
          <div v-else>
            No data
          </div>
        </td>
      </template>
    </v-data-table>
    <d-dialog
      v-if="$ready"
      v-model="sendResearchTokensDialog.isOpened"
      :disabled="sendResearchTokensDialog.isSending"
      :loading="sendResearchTokensDialog.isSending"
      title="Transfer asset"
      max-width="570px"
      :confirm-button-title="$t('userWallet.sendResearchTokensDialog.submitBtn')"
      :cancel-button-title="$t('userWallet.cancel')"
      @click:confirm="sendResearchTokens()"
    >
      <v-form
        ref="sendResearchTokensForm"
        v-model="sendResearchTokensDialog.form.valid"
      >
        <v-select
          v-model="sendResearchTokensDialog.form.account"
          label="Asset"
          :items="balances"
          outlined
          return-object
          item-text="research.title"
          item-value="research.external_id"
          :menu-props="{
            maxWidth: 525
          }"
        />
        <v-text-field
          v-model.number="sendResearchTokensDialog.form.amount"
          label="Amount"
          :rules="sendResearchTokensDialog.form.rules.amount"
          outlined
        />
        <v-autocomplete
          v-model="sendResearchTokensDialog.form.receiver"
          :items="allAccounts"
          :rules="sendResearchTokensDialog.form.rules.username"
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
        <v-textarea
          v-model="sendResearchTokensDialog.form.memo"
          outlined
          label="Notes"
          no-resize
          rows="8"
        />
      </v-form>
    </d-dialog>
  </v-skeleton-loader>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import DChartColumn from '@/components/Deipify/DChart/DChartColumn';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { InvestmentsService } from '@deip/investments-service';
  import { AssetsService } from '@deip/assets-service';
  import { assetsChore } from '@/mixins/chores';

  const investmentsService = InvestmentsService.getInstance();
  const assetsService = AssetsService.getInstance();

  export default {
    name: 'SharesInfoTable',

    components: {
      DChartColumn,
      DDialog,
      DBoxItem
    },

    mixins: [assetsChore],

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
        expanded: [],
        tableHeader: [
          {
            text: 'Asset',
            value: 'research.title'
          },
          {
            text: 'Tokens and share',
            value: 'myShare.amount',
            align: 'end'
          },
          {
            text: 'Tokens price',
            value: 'group.account.balances',
            align: 'center'
          },
          {
            text: 'Total Revenue',
            value: 'revenueHistory',
            align: 'end'
          },
          {
            value: 'actions',
            align: 'end'
          },
          {
            value: 'data-table-expand',
            align: 'start elevetion-0'
          }
        ],
        dialog: false,
        expandedInvestmentIdx: -1,

        sendResearchTokensDialog: {
          form: {
            sender: '',
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
          maxAmount: 0,
          isOpened: false,
          isSending: false
        }
      };
    },
    computed: {
      ...mapGetters({
        balances: 'Wallet/balances'
      })
    },

    created() {
      this.$store.dispatch('Wallet/loadBalances', this.$route.params.account)
        .then(() => { this.$setReady(); });
    },

    methods: {
      ...mapActions({
        loadResearchTokens: 'Wallet/loadResearchTokens',
        loadUserBalances: 'auth/loadBalances',
        loadWallet: ('Wallet/loadWallet')
      }),
      sharePercent(item) {
        const token = item.research.security_tokens.find(
          (rst) => { 
            const { assetId } = this.$$fromAssetUnits(rst);
            return assetId === item.asset_symbol;
          }
        );
        const { amount: tokenValue } = this.$$fromAssetUnits(token);
        const { amount } = this.$$fromAssetUnits(item.amount);
        return amount * 100 / tokenValue;
      },
      openSendResearchTokensDialog(item) {
        this.sendResearchTokensDialog.isOpened = true;

        this.sendResearchTokensDialog.form.valid = false;
        this.sendResearchTokensDialog.form.amount = '';
        this.sendResearchTokensDialog.form.account = item;
      },

      sendResearchTokens() {
        if (this.sendResearchTokensDialog.form.valid) {
          this.sendResearchTokensDialog.isSending = true;

          const { assetId, precision } = this.$$fromAssetUnits(this.sendResearchTokensDialog.form.account.amount);
          const amountToTransfer = this.$$toAssetUnits(this.sendResearchTokensDialog.form.amount.toString() || '0', false, { symbol: assetId, fractionCount: precision });
          
          assetsService.transferAsset(
            { privKey: this.$currentUser.privKey, username: this.$currentUserName },
            {
              from: this.sendResearchTokensDialog.form.account.owner,
              to: this.sendResearchTokensDialog.form.receiver.account.name,
              amount: amountToTransfer,
              memo: this.sendResearchTokensDialog.form.memo,
              extensions: []
            }
          )
            .then(() => {
              this.$notifier.showSuccess('Research tokens successfully sent');
            })
            .catch((err) => {
              this.$notifier.showError('Transaction was failed');
              console.error(err);
            })
            .finally(() => {
              this.sendResearchTokensDialog.isSending = false;
              this.sendResearchTokensDialog.isOpened = false;
              return this.$store.dispatch('Wallet/loadBalances', this.$route.params.account);
            });
        }
      },

      mockPriceChange(rtId) {
        return rtId * 0.3;
      },
      totalRevenue(arr) {
        return arr.reduce((val, { revenue }) => {
          const { amount } = this.$$fromAssetUnits(revenue);
          return val + amount;
        }, 0);
      },
      revenuePerToken(item) {
        const securityToken = item.research.security_tokens.find(
          (securityToken) => {
            const { assetId } = this.$$fromAssetUnits(securityToken);
            return item.asset_symbol === assetId;
          }
        );
        const { amount: totalTokenAmount } = this.$$fromAssetUnits(securityToken);
        return totalTokenAmount ? this.totalRevenue(item.securityTokenHistory) / totalTokenAmount : 0;
      },
      tokensPrice(item) {
        const valuationFactor = 1.5;
        const { amount } = this.$$fromAssetUnits(item.amount);
        return this.revenuePerToken(item) * amount * valuationFactor;
      },

      toAsset(val) {
        return this.$$toAssetUnits({
          amount: val,
          assetId: 'USD'
        })
      }
    }
  };
</script>
