<template>
  <layout-section>
    <v-skeleton-loader
      type="table-thead, table-tbody"
      :loading="!$ready"
    >
      <div class="text-h4 mb-6">
        {{ pageTitle }}
      </div>
      <content-block
        :title="$t('wallet.balance')"
      >
        <currencies-info-table :all-accounts="allAccounts" />
      </content-block>

      <content-block
        :title="$t('wallet.portfolio')"
      >
        <shares-info-table :all-accounts="allAccounts" />
      </content-block>
      <content-block
        v-if="$route.name === 'userWallet'"
        :title="$t('wallet.groups')"
      >
        <groups-info-table />
      </content-block>
    </v-skeleton-loader>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { walletStore } from '@/components/Wallet/store';
  import GroupsInfoTable from '@/components/Wallet/components/GroupsInfoTable';
  import CurrenciesInfoTable from '@/components/Wallet/components/CurrenciesInfoTable';
  import SharesInfoTable from '@/components/Wallet/components/SharesInfoTable';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'Wallet',
    components: {
      LayoutSection,
      ContentBlock,
      GroupsInfoTable,
      CurrenciesInfoTable,
      SharesInfoTable
    },
    mixins: [componentStoreFactoryOnce(walletStore)],

    data() {
      return {
        allAccounts: []
      };
    },

    computed: {
      ...mapGetters({
        groupData: 'Wallet/groupData'
      }),
      pageTitle() {
        if (this.$route.name === 'userWallet') {
          return this.$t('wallet.myAssets');
        }
        if (this.$route.name === 'groupWallet') {
          return this.$t('wallet.groupAssets', { group: this.groupData.name });
        }
        return this.$t('wallet.assets');
      }
    },

    created() {
      if (this.$route.name === 'userWallet' && this.$currentUser.username !== this.$route.params.account) {
        this.$router.back();
      }
      if (this.$route.name === 'userWallet') {
        this.$store.dispatch('Wallet/loadAssetsInfo', this.$currentUser)
          .then(() => { this.$setReady(); });
      } else if (this.$route.name === 'groupWallet') {
        this.$store.dispatch('Wallet/loadBalanceData', this.$route.params.account)
          .then(() => { this.$setReady(); });
      }
    },

    mounted() {
      Promise.all([
        usersService.getUsersListing(),
        researchGroupService.getResearchGroupsListing()
      ])
        .then(([users, researchGroups]) => {
          return [...users, ...researchGroups];
        })
        .then((accounts) => {
          this.allAccounts = accounts.flat().map((a) => {
            return { ...a, fullName: this.$options.filters.accountFullname(a) }
          });
        });
    }
  };
</script>
