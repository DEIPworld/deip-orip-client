<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ notification.metadata.approver | fullname }}</span>
    {{ $t('notifications.approvedAppl') }}
    "<span class="primary--text half-bold">{{ notification.metadata.research.title }}</span>"
    {{ $t('notifications.project') }}
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ResearchApplicationApprovedUserNotification',
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
    computed: {},

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: this.notification.metadata.research.external_id
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
