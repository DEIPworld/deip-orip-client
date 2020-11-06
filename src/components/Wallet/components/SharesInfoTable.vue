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
      item-key="tokenized_research"
      disable-sort
      show-expand
      :expanded.sync="expanded"
    >
      <!-- <template #item.research.title="{ item }">
        <span class="text-body-1">{{ item.research.title }}</span>
      </template> -->
      <template #item.myShare.amount="{ item }">
        <div class="text-body-2 white-space-nowrap">
          {{ toAsset(item.amount) }}
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
          {{ toAsset(revenuePerToken(item)) }} per token
        </div>
      </template>
      <template #item.actions="{ item }">
        <transfer-action
          :all-accounts="allAccounts"
          :transfer="{
            ...item, balances, type: 'share'
          }"
        />
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
              vAxis: {format: '## $'},
              legend: 'none'
            }"
          />
          <div v-else>
            No data
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
  import { isString } from '@/utils/helpers';
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
            text: 'Asset',
            value: 'research.title'
          },
          {
            text: 'Tokens and share',
            value: 'myShare.amount',
            align: 'end',
            class: 'white-space-nowrap'
          },
          {
            text: 'Tokens price',
            value: 'group.account.balances',
            align: 'end vertical-top',
            class: 'pt-3'
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
        if (isString(val)) {
          const assetData = this.$$fromAssetUnits(`${val}`);

          return this.$$toAssetUnits(
            assetData.stringAmount,
            true,
            { symbol: assetData.assetId, fractionCount: assetData.precision }
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
