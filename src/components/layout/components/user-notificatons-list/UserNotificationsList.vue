<template>
  <v-menu bottom left offset-y :max-height="500" :max-width="500">
    <v-btn icon large class="ma-0" slot="activator" v-show="notifications.length">
      <v-badge color="amber darken-3" right overlap>
        <v-icon size="32px" color="grey lighten-1">notifications</v-icon>
        <span slot="badge">{{ notifications.length }}</span>
      </v-badge>
    </v-btn>
    <div v-show="notifications.length" class="user-notifications-list">
      <div v-for="(notification, i) in notifications" :key="'user-notification-' + i">
        <research-proposal-user-notification
          v-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.START_RESEARCH"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </research-proposal-user-notification>
        <research-content-proposal-user-notification
          v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH_MATERIAL"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </research-content-proposal-user-notification>
        <token-sale-proposal-user-notification
          v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.START_RESEARCH_TOKEN_SALE"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </token-sale-proposal-user-notification>
        <invite-proposal-user-notification
          v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.INVITE_MEMBER"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </invite-proposal-user-notification>
        <exclusion-proposal-user-notification 
          v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.EXCLUDE_MEMBER"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </exclusion-proposal-user-notification>
        <invitation-user-notification
          v-else-if="notification.type === INVITATION"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </invitation-user-notification>
        <invitation-approved-user-notification
          v-else-if="notification.type === INVITATION_APPROVED"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </invitation-approved-user-notification>
        <invitation-rejected-user-notification
          v-else-if="notification.type === INVITATION_REJECTED"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </invitation-rejected-user-notification>
        <expert-review-user-notification
          v-else-if="notification.type === RESEARCH_CONTENT_EXPERT_REVIEW"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </expert-review-user-notification>
        <expert-review-request-user-notification
          v-else-if="notification.type === RESEARCH_CONTENT_EXPERT_REVIEW_REQUEST"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </expert-review-request-user-notification>
        <exclusion-user-notification
          v-else-if="notification.type === EXCLUSION_APPROVED"
          :notification="notification"
          @markAsRead="markNotificationAsRead">
        </exclusion-user-notification>
      </div>
    </div>
  </v-menu>
</template>
<script>

  import { PROPOSAL_TYPES } from '@/variables';
  import { UserService } from '@deip/user-service';

  const userService = UserService.getInstance();

  export default {
    name: 'UserNotificationsList',

    props: {
      notifications: { type: Array, required: true, default: () => [] }
    },
    data() {
      return {
        TYPES: PROPOSAL_TYPES,

        PROPOSAL: 'proposal',
        PROPOSAL_ACCEPTED: 'proposal-accepted',
        INVITATION: 'invitation',
        INVITATION_APPROVED: 'invitation-approved',
        INVITATION_REJECTED: 'invitation-rejected',
        EXCLUSION_APPROVED: 'exclusion-approved',
        RESEARCH_CONTENT_EXPERT_REVIEW: 'research-content-expert-review',
        RESEARCH_CONTENT_EXPERT_REVIEW_REQUEST: 'research-content-expert-review-request',
        EXPERTISE_ALLOCATED: 'expertise-allocated'
      }
    },
    computed: {},

    methods: {
      markNotificationAsRead(notification) {
        userService.markUserNotificationAsRead(notification.username, notification._id)
          .then(() => {
            this.$store.dispatch('auth/loadNotifications');
          });
      }
    },

    watch: {}
  }

</script>

<style lang="less">
  .user-notification:hover {
    background-color: #e4f0ff;
  }

  .user-notifications-list {
    width: 500px;
  }
</style>
