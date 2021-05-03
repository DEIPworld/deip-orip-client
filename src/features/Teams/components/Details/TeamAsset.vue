<template>
  <d-block :title="$t('researchGroupDetails.assetsBlock.title')">
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
            account: item.externalId
          }
        })"
      >
        <template #item.name="{ item }">
          <d-box-item
            :avatar="item.externalId | researchGroupLogoSrc(80, 80)"
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
            {{ countTokenizedResearches }}
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
    name: 'ResearchGroupAsset',

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
            text: this.$t('researchGroupDetails.assetsBlock.table.assets'),
            value: 'tokenizedActives',
            align: 'end'
          },
          {
            text: this.$t('researchGroupDetails.assetsBlock.table.tokensPrice'),
            value: 'account.balances',
            align: 'end'
          },
          {
            text: this.$t('researchGroupDetails.assetsBlock.table.totalRevenue'),
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
      countTokenizedResearches() {
        if (!this.team.researchList) return 0;
        return this.team.researchList.reduce(
          (val, p) => (val + p.security_tokens ? p.security_tokens.length : 0), 0
        );
      },
      tokensPrice() {
        const valuationFactor = 1.5;

        const totalAmount = this.team.accountSecurityTokenBalance.reduce((v, i) => {
          const { amount } = this.$$fromAssetUnits(i.amount);
          return v + amount;
        }, 0);

        const revHisTotalRevenue = this.team.revenueHistory.reduce((v, i) => {
          const val = this.$$fromAssetUnits(i.revenue).amount;

          const research = this.team.researchList ? this.team.researchList.find(
            (r) => r.externalId === i.security_token.tokenized_research
          ) : false;

          const securityTokenAmount = research ? research.security_tokens.find(
            (st) => {
              const { assetId } = this.$$fromAssetUnits(st);
              return assetId === i.security_token.string_symbol;
            }
          ) : '1 TOKEN';

          const { amount } = this.$$fromAssetUnits(securityTokenAmount);
          v += val / amount;
          return v;
        }, 0);

        return this.$$toAssetUnits({
          amount: `${totalAmount * revHisTotalRevenue * valuationFactor}`,
          assetId: 'USD'
        });
      },
      totalRevenue() {
        const revenueAmount = this.team.revenueHistory.reduce((val, { revenue }) => (
          val + this.$$fromAssetUnits(revenue).amount
        ), 0);

        return this.$$toAssetUnits({
          amount: `${revenueAmount}`,
          assetId: 'USD'
        });
      }
    }
  };
</script>
