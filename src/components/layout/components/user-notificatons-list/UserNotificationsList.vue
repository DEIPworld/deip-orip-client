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

    <v-list v-show="notifications.length" class="py-0">
      <template v-for="(notification, i) in notifications">
        <div :key="'user-notification-' + i">
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
          <research-application-user-notification
            v-else-if="notification.type === RESEARCH_APPLICATION_CREATED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-application-approved-user-notification
            v-else-if="notification.type === RESEARCH_APPLICATION_APPROVED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-application-rejected-user-notification
            v-else-if="notification.type === RESEARCH_APPLICATION_REJECTED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-application-edited-user-notification
            v-else-if="notification.type === RESEARCH_APPLICATION_EDITED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-application-deleted-user-notification
            v-else-if="notification.type === RESEARCH_APPLICATION_DELETED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
        </div>
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
  import ResearchProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchProposalUserNotification';
  import TokenSaleProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/TokenSaleProposalUserNotification';
  import InviteProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/InviteProposalUserNotification';
  import ResearchUpdateProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchUpdateProposalUserNotification';
  import ResearchGroupUpdateProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchGroupUpdateProposalUserNotification';
  import InvitationUserNotification
    from '@/components/layout/components/user-notificatons-list/components/InvitationUserNotification';
  import InvitationApprovedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/InvitationApprovedUserNotification';
  import InvitationRejectedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/InvitationRejectedUserNotification';
  import ExpertReviewUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ExpertReviewUserNotification';
  import ExpertReviewRequestUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ExpertReviewRequestUserNotification';
  import ResearchContentProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchContentProposalUserNotification';
  import ExclusionUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ExclusionUserNotification';
  import ExclusionProposalUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ExclusionProposalUserNotification';
  import ResearchApplicationUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchApplicationUserNotification';
  import ResearchApplicationApprovedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchApplicationApprovedUserNotification';
  import ResearchApplicationRejectedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchApplicationRejectedUserNotification';
  import ResearchApplicationEditedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchApplicationEditedUserNotification';
  import ResearchApplicationDeletedUserNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchApplicationDeletedUserNotification';
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'UserNotificationsList',
    components: {
      ExpertReviewRequestUserNotification,
      ExpertReviewUserNotification,
      InvitationRejectedUserNotification,
      InvitationApprovedUserNotification,
      InvitationUserNotification,
      ResearchGroupUpdateProposalUserNotification,
      ResearchUpdateProposalUserNotification,
      InviteProposalUserNotification,
      TokenSaleProposalUserNotification,
      ResearchProposalUserNotification,
      ResearchContentProposalUserNotification,
      ExclusionUserNotification,
      ExclusionProposalUserNotification,
      ResearchApplicationUserNotification,
      ResearchApplicationApprovedUserNotification,
      ResearchApplicationRejectedUserNotification,
      ResearchApplicationEditedUserNotification,
      ResearchApplicationDeletedUserNotification
    },
    // props: {
    //   notifications: { type: Array, required: true, default: () => [] }
    // },
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
        EXPERTISE_ALLOCATED: 'expertise-allocated',
        RESEARCH_APPLICATION_CREATED: 'research-application-created',
        RESEARCH_APPLICATION_APPROVED: 'research-application-approved',
        RESEARCH_APPLICATION_REJECTED: 'research-application-rejected',
        RESEARCH_APPLICATION_EDITED: 'research-application-edited',
        RESEARCH_APPLICATION_DELETED: 'research-application-deleted'
      };
    },
    computed: {
      notifications() { return this.$currentUser.notifications; },

      notificationType(notification) {
        return 'a';
      }
    },

    watch: {},

    created() {
      this.pollNotifications();
      setInterval(this.pollNotifications, 10000);
    },

    methods: {
      markNotificationAsRead(notification) {
        this.$store.dispatch('Notifications/markAsRead', [
          notification.username,
          notification._id
        ]);
      },

      pollNotifications() {
        if (accessService.isLoggedIn()) {
          this.$store.dispatch('Notifications/fetch', this.$currentUserName);
        }
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
