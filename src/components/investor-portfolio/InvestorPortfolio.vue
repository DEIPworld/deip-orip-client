<template>
  <app-layout>
    <layout-section>
      <template #sidebar>
        <investor-portfolio-inbox-left-sidebar />
        <investor-portfolio-inbox-right-sidebar v-if="!noResult" />
      </template>
      <investor-portfolio-inbox />
    </layout-section>
  </app-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'InvestorPortfolio',
    components: { LayoutSection, AppLayout, LayoutSidebar },
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
