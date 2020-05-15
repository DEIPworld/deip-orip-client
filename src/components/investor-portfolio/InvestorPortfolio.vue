<template>
  <layout-section>
    <v-navigation-drawer app clipped width="280">
      <investor-portfolio-inbox-left-sidebar />
    </v-navigation-drawer>

    <investor-portfolio-inbox />

    <template #sidebar>
      <investor-portfolio-inbox-right-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import InvestorPortfolioInboxLeftSidebar
    from '@/components/investor-portfolio/components/InvestorPortfolioInboxLeftSidebar';
  import InvestorPortfolioInboxRightSidebar
    from '@/components/investor-portfolio/components/InvestorPortfolioInboxRightSidebar';
  import InvestorPortfolioInbox from '@/components/investor-portfolio/components/InvestorPortfolioInbox';

  export default {
    name: 'InvestorPortfolio',
    components: {
      InvestorPortfolioInbox,
      InvestorPortfolioInboxRightSidebar,
      InvestorPortfolioInboxLeftSidebar,
      LayoutSection
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        noResult: 'investorPortfolio/noResult'
      })

    },
    data() {
      return {};
    },

    created() {

    },

    methods: {}
  };
</script>

<style lang="less" scoped>

  @import "./../../styles/colors.less";

</style>
