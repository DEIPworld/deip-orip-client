<template>
  <base-page-layout left-sidebar-class="xl2 lg2 md2 sm12 xs12" content-class="xl7 lg7 md7 sm12 xs12" right-sidebar-class="xl3 lg3 md3 sm12 xs12">
    <investor-dashboard-inbox-left-sidebar slot="left-sidebar"></investor-dashboard-inbox-left-sidebar>
    <investor-dashboard-inbox slot="content"></investor-dashboard-inbox>
    <div slot="right-sidebar">I AM RIGHT</div>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-oa-rpc-client';
import moment from 'moment';

export default {
  name: "Dashboard",
  
  computed: {
    ...mapGetters({
      user: "auth/user"
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
