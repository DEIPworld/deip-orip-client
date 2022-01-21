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
      item-key="tokenizedProject"
      disable-sort
      show-expand
      :expanded.sync="expanded"
    >
      <!-- <template #item.project.title="{ item }">
        <span class="text-body-1">{{ item.project.title }}</span>
      </template> -->
      <template #item.myShare.amount="{ item }">
        <div class="text-body-2 white-space-nowrap">
          {{ toAsset(item) }}
        </div>
        <div class="text-caption text--secondary">
          {{ sharePercent(item) }} %
        </div>
      </template>
      <template #item.group.account.balances="{ item }">
        <div class="text-body-2 mt-4 white-space-nowrap">
          {{ toAsset(tokensPrice(item)) }}
        </div>
      </template>
      <template #item.revenueHistory="{ item }">
        <div class="text-body-2 mt-4 white-space-nowrap">
          {{ toAsset(totalRevenue(item.revenueHistory)) }}
        </div>
        <div class="text-caption text--secondary mb-4 white-space-nowrap">
          {{ toAsset(revenuePerToken(item)) }} {{ $t('wallet.perToken') }}
        </div>
      </template>
      <template #item.actions="{ item }">
        <transfer-action
          :all-accounts="allAccounts"
          :asset="{
            ...item, balances, type: 'share'
          }"
        />
      </template>
      <template #expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0">
          <div class="font-weight-bold mt-4">
            {{ $t('wallet.revPerToken') }}
          </div>
          <d-chart-column
            v-if="item.revenueHistoryChartData.length"
            :data="[['Date', 'Revenue'], ...item.revenueHistoryChartData]"
            :options="{
              chartArea: {width: '100%'},
              vAxis: {format: '## $'},
              legend: 'none'
            }"
          />
          <div v-else>
            {{ $t('wallet.noData') }}
          </div>
        </td>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DChartColumn from '@/components/Deipify/DChart/DChartColumn';
  import TransferAction from '@/components/Wallet/components/TransferAction';
  import { isObject } from '@/utils/helpers';
  import { assetsChore } from '@/mixins/chores';

  export default {
    name: 'SharesInfoTable',

    components: {
      DChartColumn,
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
        expanded: [],
        tableHeader: [
          {
            text: this.$t('wallet.asset'),
            value: 'project.title'
          },
          {
            text: this.$t('wallet.tokensAndShare'),
            value: 'myShare.amount',
            align: 'end',
            class: 'white-space-nowrap'
          },
          {
            text: this.$t('wallet.tokensPrice'),
            value: 'group.account.balances',
            align: 'end vertical-top',
            class: 'pt-3'
          },
          {
            text: this.$t('wallet.totalRevenue'),
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
        ]
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
      sharePercent(item) {
        const token = item.project.securityTokens.find(
          (rst) => rst.symbol === item.symbol
        );
        return (item.amount * 100 / token.amount).toFixed(2);
      },

      mockPriceChange(rtId) {
        return rtId * 0.3;
      },
      totalRevenue(arr) {
        return arr.reduce((val, { revenue }) => val + Number(revenue.amount), 0);
      },
      revenuePerToken(item) {
        const securityToken = item.project.securityTokens.find(
          (st) => item.assetSymbol === st.symbol
        );
        return securityToken
          ? this.totalRevenue(item.securityTokenHistory) / securityToken.amount : 0;
      },
      tokensPrice(item) {
        const valuationFactor = 1.5;
        return this.revenuePerToken(item) * item.amount * valuationFactor;
      },

      toAsset(val) {
        if (isObject(val)) {
          return this.$$toAssetUnits(
            val.amount,
            true,
            { symbol: val.symbol, fractionCount: val.precision }
          );
        }
        return this.$$toAssetUnits({
          amount: `${val}`,
          assetId: 'USD'
        });
      }
    }
  };
</script>
