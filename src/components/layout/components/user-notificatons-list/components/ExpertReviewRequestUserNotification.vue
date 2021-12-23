<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ requestorProfile | fullname }}</span>
    {{ $t('notifications.requestedReview') }}
    "<span class="primary--text half-bold">{{ notification.metadata.projectContent.title }}</span>"
    {{ $t('notifications.material') }}
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ExpertReviewRequestUserNotification',
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
      expertProfile() {
        return this.notification.metadata.expert;
      },
      requestorProfile() {
        return this.notification.metadata.requestor;
      }
    },

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'project.content.details',
          params: {
            projectId: this.notification.metadata.project._id,
            contentId: this.notification.metadata.projectContent._id
          },
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
