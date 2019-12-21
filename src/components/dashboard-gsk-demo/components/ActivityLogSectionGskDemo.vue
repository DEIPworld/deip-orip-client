<template>
  <v-layout row wrap>
    <v-flex xl11 lg11 md11 sm11 xs11 offset-xl1-right offset-lg1-right offset-md1-right offset-sm1-right offset-xs1-right>
      <div class="title bold pb-5">Activity Log</div>
      <div>
        <research-group-activity-log-list v-for="({ researchGroup, logs }, i) in activityLogsByGroups"
          :researchGroup="researchGroup"
          :researchGroupLogs="logs"
          :key="'research-group-activity-log-' + i">
        </research-group-activity-log-list>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { types } from './../../../services/ProposalService';

export default {
  name: "ActivityLogSectionGskDemo",
  props: {

  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
      activityLogsByGroups: 'dashboard_gsk_demo/activityLogsByGroups'
    })
  },

  methods: {

  },

  data() {
    return {
      ...types
    }
  }
};
</script>

<style lang="less" scoped>

@import "./../../../styles/colors.less";

.group-activity-log {
  border-top: 1px solid @grey-lighten-2;
  border-bottom: 1px solid @grey-lighten-2;
}

</style>
