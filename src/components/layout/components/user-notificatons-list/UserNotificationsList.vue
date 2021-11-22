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
            v-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-content-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH_MATERIAL"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <token-sale-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.CREATE_RESEARCH_TOKEN_SALE"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <invite-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.INVITE_MEMBER"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <exclusion-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.EXCLUDE_MEMBER"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-update-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.UPDATE_RESEARCH"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-group-update-proposal-user-notification
            v-else-if="(notification.type === notificationTypes.PROPOSAL
              || notification.type === notificationTypes.PROPOSAL_ACCEPTED)
              && notification.metadata.proposal.action === TYPES.UPDATE_RESEARCH_GROUP"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <invitation-user-notification
            v-else-if="notification.type === notificationTypes.INVITATION"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <invitation-approved-user-notification
            v-else-if="notification.type === notificationTypes.INVITATION_APPROVED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <invitation-rejected-user-notification
            v-else-if="notification.type === notificationTypes.INVITATION_REJECTED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <expert-review-user-notification
            v-else-if="notification.type === notificationTypes.RESEARCH_CONTENT_EXPERT_REVIEW"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <expert-review-request-user-notification
            v-else-if="notification.type === notificationTypes.RESEARCH_CONTENT_EXPERT_REVIEW_REQUEST"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <exclusion-user-notification
            v-else-if="notification.type === notificationTypes.EXCLUSION_APPROVED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-nda-proposed-notification
            v-else-if="notification.type === notificationTypes.RESEARCH_NDA_PROPOSED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-nda-signed-notification
            v-else-if="notification.type === notificationTypes.RESEARCH_NDA_SIGNED"
            :notification="notification"
            @markAsRead="markNotificationAsRead"
          />
          <research-nda-rejected-notification
            v-else-if="notification.type === notificationTypes.RESEARCH_NDA_REJECTED"
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

  import { PROPOSAL_TYPES, USER_NOTIFICATION_TYPE } from '@/variables';
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
  import ResearchNdaProposedNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchNdaProposedNotification';
  import ResearchNdaSignedNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchNdaSignedNotification';
  import ResearchNdaRejectedNotification
    from '@/components/layout/components/user-notificatons-list/components/ResearchNdaRejectedNotification';
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

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
      ResearchNdaProposedNotification,
      ResearchNdaSignedNotification,
      ResearchNdaRejectedNotification
    },
    // props: {
    //   notifications: { type: Array, required: true, default: () => [] }
    // },
    data() {
      return {
        TYPES: PROPOSAL_TYPES,
        notificationTypes: USER_NOTIFICATION_TYPE
      };
    },
    computed: {
      notifications() { return this.$currentUser.notifications; }
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
          this.$store.dispatch('Notifications/fetch', this.$currentUser.username);
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
