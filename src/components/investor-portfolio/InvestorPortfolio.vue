<template>
  <base-page-layout left-sidebar-class="xl2 lg2 md2 sm12 xs12" content-class="xl7 lg7 md7 sm12 xs12" right-sidebar-class="xl3 lg3 md3 sm12 xs12">
    <investor-portfolio-inbox-left-sidebar slot="left-sidebar"></investor-portfolio-inbox-left-sidebar>
    <investor-portfolio-inbox slot="content"></investor-portfolio-inbox>
    <investor-portfolio-inbox-right-sidebar v-if="!noResult" slot="right-sidebar"></investor-portfolio-inbox-right-sidebar>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/rpc-client';
import moment from 'moment';

export default {
  name: "InvestorPortfolio",

  computed: {
    ...mapGetters({
      user: "auth/user",
      noResult: "investorPortfolio/noResult",
    }),

  },
  data() {
    return {

    };
  },

  methods: {



  },

  created() {

  }
};
</script>

<style lang="less" scoped>

@import "./../../styles/colors.less";

</style>
