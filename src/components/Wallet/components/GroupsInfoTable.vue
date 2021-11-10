<template>
  <v-skeleton-loader
    type="table-thead, table-tbody"
    :loading="!$ready"
  >
    <v-data-table
      v-custom="'hover-row'"
      :headers="groupsListTableHeader"
      :items="allGroups"
      :hide-default-footer="allGroups.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
      disable-sort
      @click:row="(item) => $router.push({
        name: 'groupWallet',
        params: {
          account: item.external_id
        }
      })"
    >
      <template #item.name="{ item }">
        <d-box-item
          :avatar="item.external_id | researchGroupLogoSrc(80, 80)"
          :size="40"
          class="my-3"
        >
          <v-clamp
            autoresize
            :max-lines="1"
            class="text-body-2"
          >
            {{ item.name }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.tokenizedActives="{ item }">
        {{ item.researchList ? countTokenizedResearches(item.researchList) : 0 }}
      </template>
      <template #item.account.balances="{ item }">
        {{ toAsset(tokensPrice(item)) }}
      </template>
      <template #item.revenueHistory="{ item }">
        {{ toAsset(item.revenueHistory ? `${totalRevenue(item.revenueHistory)}` : '0') }}
      </template>
      <template #item.action>
        <v-icon>
          keyboard_arrow_right
        </v-icon>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { assetsChore } from '@/mixins/chores';

  export default {
    name: 'GroupsInfoTable',

    components: {
      DBoxItem
    },

    mixins: [assetsChore],

    data() {
      return {
        groupsListTableHeader: [
          {
            value: 'name'
          },
          {
            text: this.$t('wallet.assets'),
            value: 'tokenizedActives',
            align: 'end'
          },
          {
            text: this.$t('wallet.tokensPrice'),
            value: 'account.balances',
            align: 'end'
          },
          {
            text: this.$t('wallet.totalRevenue'),
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
        allGroups: 'Wallet/allGroups'
      })
    },
    created() {
      this.$store.dispatch('Wallet/loadAllGroups', this.$currentUser.username)
        .then(() => { this.$setReady(); });
    },
    methods: {
      countTokenizedResearches(arr) {
        return arr.reduce(
          (val, p) => (val + p.security_tokens ? p.security_tokens.length : 0), 0
        );
      },
      totalRevenue(arr) {
        return arr.reduce((val, { revenue }) => (
          val + Number(revenue.amount)
        ), 0);
      },
      tokensPrice(item) {
        const valuationFactor = 1.5;
        const totalAmount = item.accountSecurityTokenBalances.reduce(
          (v, i) => v + Number(i.amount), 0
        );

        const revHisTotalRevenue = item.revenueHistory ? item.revenueHistory.reduce((v, i) => {
          const val = Number(i.revenue.amount);

          const research = item.researchList ? item.researchList.find(
            (r) => r.external_id === i.security_token.tokenized_research
          ) : false;

          const securityTokenAmount = research ? research.securityTokens.find(
            (st) => st.symbol === i.security_token.string_symbol
          ) : {
            amount: '1',
            symbol: 'TOKEN',
            precision: 0
          };

          v += val / Number(securityTokenAmount.amount);
          return v;
        }, 0) : 0;
        return totalAmount * revHisTotalRevenue * valuationFactor;
      },

      toAsset(val) {
        return this.$$toAssetUnits({
          amount: `${val}`,
          assetId: 'USD'
        });
      }
    }
  };
</script>
