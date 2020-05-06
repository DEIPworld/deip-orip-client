<template>
  <v-menu
    bottom
    left
    offset-y
    :max-height="500"
    :max-width="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-show="notifications.length"
        icon
        large
        class="ma-0"
        v-on="on"
      >
        <v-badge color="amber darken-3" right overlap>
          <v-icon size="32px" color="grey lighten-1">
            notifications
          </v-icon>
          <span slot="badge">{{ notifications.length }}</span>
        </v-badge>
      </v-btn>
    </template>

    <v-list v-show="notifications.length" class="user-notifications-list">
      <template v-for="(notification, i) in notifications">
        <v-list-item :key="'user-notification-' + i" class="nlfx">
          <v-list-item-content>
            <research-proposal-user-notification
              v-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <research-content-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH_MATERIAL"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <token-sale-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED) && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH_TOKEN_SALE"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <invite-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.INVITE_MEMBER"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <exclusion-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.EXCLUDE_MEMBER"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <research-update-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.UPDATE_RESEARCH"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <research-group-update-proposal-user-notification
              v-else-if="(notification.type === PROPOSAL || notification.type === PROPOSAL_ACCEPTED)&& notification.metadata.proposal.action === TYPES.UPDATE_RESEARCH_GROUP"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <invitation-user-notification
              v-else-if="notification.type === INVITATION"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <invitation-approved-user-notification
              v-else-if="notification.type === INVITATION_APPROVED"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <invitation-rejected-user-notification
              v-else-if="notification.type === INVITATION_REJECTED"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <expert-review-user-notification
              v-else-if="notification.type === RESEARCH_CONTENT_EXPERT_REVIEW"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <expert-review-request-user-notification
              v-else-if="notification.type === RESEARCH_CONTENT_EXPERT_REVIEW_REQUEST"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
            <exclusion-user-notification
              v-else-if="notification.type === EXCLUSION_APPROVED"
              :notification="notification"
              @markAsRead="markNotificationAsRead"
            />
          </v-list-item-content>
        </v-list-item>
        <v-divider
          v-if="i + 1 < notifications.length"
          :key="`${i}-notification-divider`"
        />
      </template>
    </v-list>
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
      };
    },
    computed: {},

    watch: {},

    methods: {
      markNotificationAsRead(notification) {
        userService.markUserNotificationAsRead(notification.username, notification._id)
          .then(() => {
            this.$store.dispatch('auth/loadNotifications');
          });
      }
    }
  };

</script>

<style lang="scss">
  .nlfx {
    > * {
      width: 100%;
      max-width: 500px;
    }
  }
</style>
