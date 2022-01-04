<template>
  <d-block :title="$t('teamDetails.assetsBlock.title')">
    <div>
      <v-data-table
        v-custom="'hover-row'"
        :headers="tableHeader"
        :items="[team]"
        hide-default-footer
        disable-sort
        @click:row="(item) => $router.push({
          name: 'groupWallet',
          params: {
            account: item._id
          }
        })"
      >
        <template #item.name="{ item }">
          <d-box-item
            :avatar="item._id | teamLogoSrc(80, 80)"
            :size="40"
            class="my-3"
          >
            <v-clamp
              autoresize
              :max-lines="1"
              class="text-body-2"
            >
              {{ item | accountFullname }}
            </v-clamp>
          </d-box-item>
        </template>
        <template #item.tokenizedActives="{ item }">
          <span class="text-body-2">
            {{ countTokenizedProjects }}
          </span>
        </template>
        <template #item.account.balances="{ item }">
          <span class="text-body-2">
            {{ tokensPrice }}
          </span>
        </template>
        <template #item.revenueHistory="{ item }">
          <span class="text-body-2">
            {{ totalRevenue }}
          </span>
        </template>
        <template #item.action>
          <v-icon>
            keyboard_arrow_right
          </v-icon>
        </template>
      </v-data-table>
      <v-divider />
    </div>
  </d-block>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { assetsChore } from '@/mixins/chores';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'TeamAsset',

    components: {
      DBoxItem,
      DBlock
    },

    mixins: [assetsChore],

    data() {
      return {
        tableHeader: [
          {
            value: 'name'
          },
          {
            text: this.$t('teamDetails.assetsBlock.table.assets'),
            value: 'tokenizedActives',
            align: 'end'
          },
          {
            text: this.$t('teamDetails.assetsBlock.table.tokensPrice'),
            value: 'account.balances',
            align: 'end'
          },
          {
            text: this.$t('teamDetails.assetsBlock.table.totalRevenue'),
            value: 'revenueHistory',
            align: 'end'
          },
          {
            value: 'action'
          }
        ]
      };
    },

    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      }),
      countTokenizedProjects() {
        if (!this.team.projectList) return 0;
        return this.team.projectList.reduce(
          (val, p) => (val + p.security_tokens ? p.security_tokens.length : 0), 0
        );
      },
      tokensPrice() {
        const valuationFactor = 1.5;

        const totalAmount = this.team.accountSecurityTokenBalance.reduce(
          (v, i) => v + Number(i.amount), 0
        );
        const revHisTotalRevenue = this.team.revenueHistory.reduce((v, i) => {
          const val = Number(i.revenue.amount);
          const project = this.team.projectList ? this.team.projectList.find(
            (r) => r._id === i.security_token.tokenized_project
          ) : false;

          const securityTokenAmount = project ? project.security_tokens.find(
            (st) => st.symbol === i.security_token.string_symbol
          ) : {
            amount: '1',
            symbol: 'TOKEN',
            precision: 0
          };

          v += val / securityTokenAmount.amount;
          return v;
        }, 0);

        return this.$$toAssetUnits({
          amount: `${totalAmount * revHisTotalRevenue * valuationFactor}`,
          assetId: 'USD'
        });
      },
      totalRevenue() {
        const revenueAmount = this.team.revenueHistory.reduce((val, { revenue }) => (
          val + Number(revenue.amount)
        ), 0);

        return this.$$toAssetUnits({
          amount: `${revenueAmount}`,
          assetId: 'USD'
        });
      }
    }
  };
</script>
