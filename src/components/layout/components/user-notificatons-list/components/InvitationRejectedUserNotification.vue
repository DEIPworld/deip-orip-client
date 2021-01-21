<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ inviteeProfile | fullname }}</span>
    {{ $t('notifications.declinedInv') }}
    "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'InvitationRejectedUserNotification',
    components: { UserNotificationsListItem },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    data() {
      return {};
    },
    computed: {
      inviteeProfile() {
        return this.notification.metadata.invitee;
      }
    },

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'UserDetails',
          params: {
            account_name: encodeURIComponent(this.notification.metadata.invitee.account.name)
          }
        });

        this.markAsRead();
      },

      markAsRead($event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        this.$emit('markAsRead', this.notification);
      }
    }
  };
</script>

<style lang="less">

</style>
