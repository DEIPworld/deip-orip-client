<template>
  <base-page-layout>
    <v-card slot="content" class="full-height full-width pa-5">
      <v-layout row>
        <v-flex xs8 sm8 md8 lg8 xl8>
          <v-layout column fill-height>
            <activity-log-section-gsk-demo></activity-log-section-gsk-demo>
            <access-requests-section-gsk-demo></access-requests-section-gsk-demo>
          </v-layout>
        </v-flex>
        <v-flex xs4 sm4 md4 lg4 xl4>
          <projects-list-section-gsk-demo></projects-list-section-gsk-demo>
        </v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-oa-rpc-client';
import moment from 'moment';

export default {
  name: "DashboardGskDemo",

  data() {
    return {

    };
  },
  
  computed: {
    ...mapGetters({
      user: "auth/user",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
      themeSettings: 'layout/themeSettings'
    })
  },

  methods: {

  }
};
</script>

<style lang="less" scoped>
@import "./../../styles/colors.less";

</style>
