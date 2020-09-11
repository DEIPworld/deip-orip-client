<template>
  <d-layout-section>
    <portal to="sidebar">
      <investor-portfolio-inbox-left-sidebar />
    </portal>
    <d-layout-section-main>
      <investor-portfolio-inbox />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <investor-portfolio-inbox-right-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import InvestorPortfolioInboxLeftSidebar
    from '@/components/investor-portfolio/components/InvestorPortfolioInboxLeftSidebar';
  import InvestorPortfolioInboxRightSidebar
    from '@/components/investor-portfolio/components/InvestorPortfolioInboxRightSidebar';
  import InvestorPortfolioInbox from '@/components/investor-portfolio/components/InvestorPortfolioInbox';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'InvestorPortfolio',
    components: {
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection,
      InvestorPortfolioInbox,
      InvestorPortfolioInboxRightSidebar,
      InvestorPortfolioInboxLeftSidebar
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
