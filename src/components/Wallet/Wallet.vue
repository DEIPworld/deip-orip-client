<template>
  <layout-section>
    <content-block
      :title="$t('userWallet.balance')"
    >
      <currencies-info-table :all-accounts="allAccounts" />
    </content-block>

    <content-block
      :title="$t('userWallet.portfolio')"
    >
      <shares-info-table :all-accounts="allAccounts" />
    </content-block>
    <content-block
      v-if="$route.name === 'userWallet'"
      :title="$t('userWallet.groups')"
    >
      <groups-info-table />
    </content-block>
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
  import deipRpc from '@deip/rpc-client';
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
        investments: 'Wallet/investments'
      })
    },

    mounted() {
      deipRpc.api
        .lookupAccountsAsync('0', 10000)
        .then((accounts) => {
          const blackList = ['regacc', 'hermes', 'initdelegate'];

          const usersToInvite = accounts
            .filter(
              (a) => (!a.is_research_group && !blackList.some((username) => username === a.name))
            ).map((a) => a.name);
          const groupsToInvite = accounts
            .filter(
              (a) => (a.is_research_group && !blackList.some((name) => name === a.name))
            ).map((a) => researchGroupService.getResearchGroup(a.name));
          return Promise.all([
            usersService.getEnrichedProfiles(usersToInvite),
            ...groupsToInvite
          ]);
        })
        .then((accounts) => {
          this.allAccounts = accounts.flat().map((a) => {
            if (a.account.is_research_group) {
              return { ...a, fullName: a.name };
            }
            if (a.profile) {
              return { ...a, fullName: this.$options.filters.fullname(a) };
            }
            return {};
          });
        });
    }
  };
</script>
