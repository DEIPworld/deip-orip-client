<template>
  <v-expansion-panels class="elevation-0 group-activity-log">
    <v-expansion-panel-content>
      <template slot="header">
        <v-row align="center">
          <div><img width="30px" height="30px" :src="$options.filters.teamLogoSrc(team._id)"></div>
          <div class="primary--text text-body-2 align-self-center px-2">
            {{ team.name }}
          </div>
        </v-row>
      </template>
      <v-card>
        <v-card-text>
          <div v-for="(log, i) in teamLogs" :key="`activity-log-${i}`" class="py-2">
            <project-proposal-activity-log-entry
              v-if="(log.type === PROPOSAL || log.type === PROPOSAL_ACCEPTED) && log.metadata.proposal.action === TYPES.CREATE_PROJECT"
              :log="log"
            />
            <project-content-proposal-activity-log-entry
              v-else-if="(log.type === PROPOSAL || log.type === PROPOSAL_ACCEPTED) && log.metadata.proposal.action === TYPES.CREATE_PROJECT_MATERIAL"
              :log="log"
            />
            <invite-proposal-activity-log-entry
              v-else-if="(log.type === PROPOSAL || log.type === PROPOSAL_ACCEPTED) && log.metadata.proposal.action === TYPES.INVITE_MEMBER"
              :log="log"
            />
            <token-sale-proposal-activity-log-entry
              v-else-if="(log.type === PROPOSAL || log.type === PROPOSAL_ACCEPTED) && log.metadata.proposal.action === TYPES.CREATE_PROJECT_TOKEN_SALE"
              :log="log"
            />
            <proposal-vote-activity-log-entry
              v-else-if="log.type === PROPOSAL_VOTE"
              :log="log"
            />
            <invitation-approved-activity-log-entry
              v-else-if="log.type === INVITATION_APPROVED"
              :log="log"
            />
            <invitation-rejected-activity-log-entry
              v-else-if="log.type === INVITATION_REJECTED"
              :log="log"
            />
            <project-content-expert-review-activity-log-entry
              v-else-if="log.type === PROJECT_CONTENT_EXPERT_REVIEW"
              :log="log"
            />
            <project-content-expert-review-request-activity-log-entry
              v-else-if="log.type === PROJECT_CONTENT_EXPERT_REVIEW_REQUEST"
              :log="log"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panels>
</template>

<script>

  import { mapGetters } from 'vuex';
  import { PROPOSAL_TYPES } from '@/variables';

  export default {
    name: 'TeamActivityLogList',
    props: {
      team: { type: Object, required: true, default: () => {} },
      teamLogs: { type: Array, required: true, default: () => [] }
    },
    data() {
      return {
        TYPES: PROPOSAL_TYPES,

        PROPOSAL: 'proposal',
        PROPOSAL_ACCEPTED: 'proposal-accepted',
        PROPOSAL_VOTE: 'proposal-vote',
        INVITATION_APPROVED: 'invitation-approved',
        INVITATION_REJECTED: 'invitation-rejected',
        PROJECT_CONTENT_EXPERT_REVIEW: 'project-content-expert-review',
        PROJECT_CONTENT_EXPERT_REVIEW_REQUEST: 'project-content-expert-review-request'
      };
    },
    computed: {},

    watch: {},

    methods: {}
  };

</script>

<style lang="less">

</style>
