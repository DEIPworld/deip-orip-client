<template>
  <v-menu bottom left offset-y :max-height="500" :max-width="500">
    <v-btn icon large class="ma-0" slot="activator" v-show="notifications.length">
      <v-badge color="amber darken-3" right overlap>
        <v-icon size="32px" color="grey lighten-1">notifications</v-icon>
        <span slot="badge">{{ notifications.length }}</span>
      </v-badge>
    </v-btn>
    <div v-show="notifications.length">
      <div v-for="(notification, i) in notifications" :key="'user-notification-' + i">
        <research-proposal-user-notification 
          v-if="(notification.type === 'proposal' || notification.type === 'proposal-accepted') && notification.metadata.proposal.action === START_RESEARCH" 
          :notification="notification" 
          @markAsRead="readNotification">
        </research-proposal-user-notification>
        <research-content-proposal-user-notification
          v-else-if="(notification.type === 'proposal' || notification.type === 'proposal-accepted') && notification.metadata.proposal.action === CREATE_RESEARCH_MATERIAL"
          :notification="notification"
          @markAsRead="readNotification">
        </research-content-proposal-user-notification>
        <token-sale-proposal-user-notification
          v-else-if="(notification.type === 'proposal' || notification.type === 'proposal-accepted') && notification.metadata.proposal.action === START_RESEARCH_TOKEN_SALE"
          :notification="notification"
          @markAsRead="readNotification">
        </token-sale-proposal-user-notification>
        <invite-proposal-user-notification 
          v-else-if="(notification.type === 'proposal' || notification.type === 'proposal-accepted')&& notification.metadata.proposal.action === INVITE_MEMBER"
          :notification="notification"
          @markAsRead="readNotification">
        </invite-proposal-user-notification>
        <invitation-user-notification 
          v-else-if="notification.type === 'invitation'"
          :notification="notification"
          @markAsRead="readNotification">
        </invitation-user-notification>
        <invitation-approved-user-notification
          v-else-if="notification.type === 'invitation-approved'"
          :notification="notification"
          @markAsRead="readNotification">
        </invitation-approved-user-notification>
        <invitation-rejected-user-notification
          v-else-if="notification.type === 'invitation-rejected'"
          :notification="notification"
          @markAsRead="readNotification">
        </invitation-rejected-user-notification>
        <expert-review-user-notification
          v-else-if="notification.type === 'research-content-expert-review'"
          :notification="notification"
          @markAsRead="readNotification">
        </expert-review-user-notification>
        <expert-review-request-user-notification
          v-else-if="notification.type === 'research-content-expert-review-request'"
          :notification="notification"
          @markAsRead="readNotification">
        </expert-review-request-user-notification>
        <research-content-access-request-user-notification
          v-else-if="notification.type === 'research-content-access-request'"
          :notification="notification"
          @markAsRead="readNotification"
        ></research-content-access-request-user-notification>
        <research-content-access-request-approved-user-notification 
          v-else-if="notification.type === 'research-content-access-request-approved'"
          :notification="notification"
          @markAsRead="readNotification">
        </research-content-access-request-approved-user-notification>
        <research-content-access-request-rejected-user-notification 
          v-else-if="notification.type === 'research-content-access-request-rejected'"
          :notification="notification"
          @markAsRead="readNotification">
        </research-content-access-request-rejected-user-notification>
      </div>
    </div>
  </v-menu>
</template>
<script>

import httpService from './../../../services/http/notifications';
import { types } from './../../../services/ProposalService';
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';

export default {
  name: 'NotificationsList',
  props: {
    notifications: { type: Array, required: true, default: () => [] }
  },
  data() {
    return {
      ...types
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  methods: {
    readNotification($event, notification) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }

      httpService.markUserNotificationAsRead(this.user.username, notification._id)
        .then(() => {
          this.$store.dispatch('auth/loadNotifications');
        });
    }
  },
  
  watch: {

  }
}

</script>

<style lang="less">
  .user-notification:hover {
    background-color: #e4f0ff;
  }
</style>