<template>
  <v-layout row wrap>
    <v-flex xl11 lg11 md11 sm11 xs11 offset-xl1-right offset-lg1-right offset-md1-right offset-sm1-right offset-xs1-right>
      <div class="title bold pb-5">Activity Log</div>
      <div>
        <v-expansion-panel class="elevation-0 group-activity-log">
          <v-expansion-panel-content v-for="(item, i) in activityLogsByGroups" :key="`activity-log-${i}`">
            <template slot="header">
              <v-layout align-baseline>
                <div><img width="30px" height="30px" :src="`/static/research_groups/${item.researchGroup.permlink}-mini.png`" /></div>
                <div class="primary--text body-2 align-self-center px-2">{{item.researchGroup.name}}</div>
              </v-layout>
            </template>
            <v-card>
              <v-card-text>
                <div class="py-2" v-for="(log, j) in item.entries" :key="`activity-log-${i}-${j}`">
                  <research-proposal-activity-log-entry v-if="(log.type == 'new-proposal' || log.type == 'accepted-proposal') && log.metadata.proposal.action == 1" :log="log"></research-proposal-activity-log-entry>
                  <research-content-proposal-activity-log-entry v-else-if="(log.type == 'new-proposal' || log.type == 'accepted-proposal') && log.metadata.proposal.action == 10" :log="log"></research-content-proposal-activity-log-entry>
                  <invite-proposal-activity-log-entry v-else-if="(log.type == 'new-proposal' || log.type == 'accepted-proposal') && log.metadata.proposal.action == 2" :log="log"></invite-proposal-activity-log-entry>
                  <token-sale-proposal-activity-log-entry v-else-if="(log.type == 'new-proposal' || log.type == 'accepted-proposal') && log.metadata.proposal.action == 5" :log="log"></token-sale-proposal-activity-log-entry>
                  <vote-proposal-activity-log-entry v-else-if="log.type == 'proposal-vote'" :log="log"></vote-proposal-activity-log-entry>
                  <approved-invitation-activity-log-entry v-else-if="log.type == 'approved-invitation'" :log="log"></approved-invitation-activity-log-entry>
                  <rejected-invitation-activity-log-entry v-else-if="log.type == 'rejected-invitation'" :log="log"></rejected-invitation-activity-log-entry>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

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
