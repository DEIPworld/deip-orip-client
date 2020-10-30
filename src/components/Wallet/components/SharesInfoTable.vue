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
      item-key="group.external_id"
      disable-sort
      show-expand
      :expanded.sync="expanded"
    >
      <template #item.research.research_group.name="{ item }">
        <span class="text-body-1">{{ item.research.research_group.name }}</span>
      </template>
      <template #item.myShare.amount="{ item }">
        <div class="text-body-1">
          {{ item.shareHolders.length }}
        </div>
        <div v-if="item.myShare" class="text-body-2 text--secondary">
          {{ convertToPercent(item.myShare.amount) }} %
        </div>
      </template>
      <template #item.group.account.balances="{ item }">
        {{ mockTokenPrice(item.research.id, DEIP_100_PERCENT) | currency }}
      </template>
      <template #item.revenueHistory="{ item }">
        <div class="text-body-1 mt-4">
          $ {{ totalRevenue(item.revenueHistory) }}
        </div>
        <div class="text-body-2 text--secondary mb-4">
          {{ `${item.revenueHistory && item.revenueHistory.length ?
            `$ ${fromAssetsToFloat(item.revenueHistory[0].revenue)} per token` : '$ 0'}` }}
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
        <td :colspan="headers.length">
          <d-chart-column
            v-if="item.revenueHistoryChartData.length"
            :data="[['Date', 'Revenue'], ...item.revenueHistoryChartData]"
            :options="{
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
              <v-clamp :max-lines="1" class="text-h6">
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
              <v-clamp :max-lines="1" class="text-h6">
                {{ item.fullName }}
              </v-clamp>
            </d-box-item>
          </template>
        </v-autocomplete>
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

  const investmentsService = InvestmentsService.getInstance();

  export default {
    name: 'SharesInfoTable',


    components: {
      DChartColumn,
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
        expanded: [],
        tableHeader: [
          {
            text: 'Team',
            value: 'research.research_group.name'
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
          research: null,
          form: {
            sender: '',
            receiver: '',
            securityTokenExternalId: '',
            amount: 0,
            valid: false,
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
      openSendResearchTokensDialog(item) {
        this.sendResearchTokensDialog.isOpened = true;
        setTimeout(() => {
          this.$refs.sendResearchTokensForm.reset();
        });

        this.sendResearchTokensDialog.securityTokenExternalId = item.security_token_external_id;
        this.sendResearchTokensDialog.form.valid = false;
        this.sendResearchTokensDialog.form.amount = 0;
      },

      closeSendResearchTokensDialog() {
        this.sendResearchTokensDialog.isOpened = false;
      },

      sendResearchTokens() {
        if (this.sendResearchTokensDialog.form.valid) {
          this.sendResearchTokensDialog.isSending = true;

          investmentsService.transferSecurityToken(
            { privKey: this.$currentUser.privKey, username: this.$currentUserName },
            {
              sender: this.$route.params.account,
              receiver: this.sendResearchTokensDialog.form.receiver.account.name,
              securityTokenExternalId: this.sendResearchTokensDialog.securityTokenExternalId,
              amount: this.sendResearchTokensDialog.form.amount
            }
          )
            .then(() => {
              this.$notifier.showSuccess('Research tokens successfully sent');
              this.closeSendResearchTokensDialog();
            })
            .catch((err) => {
              this.$notifier.showError('Transaction was failed');
              console.error(err);
            })
            .finally(() => {
              this.sendResearchTokensDialog.isSending = false;
              return this.$store.dispatch('Wallet/loadBalances', this.$route.params.account);
            });
        }
      },

      mockPriceChange(rtId) {
        return rtId * 0.3;
      },
      totalRevenue(arr) {
        return arr.reduce((val, { revenue }) => (val + this.fromAssetsToFloat(revenue)), 0);
      }
    }
  };
</script>
