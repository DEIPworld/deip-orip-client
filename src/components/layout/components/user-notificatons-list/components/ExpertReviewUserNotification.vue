<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ reviewerProfile | fullname }}</span>
    {{ $t('notifications.leftReview') }}
    "<span class="primary--text half-bold">{{ notification.metadata.projectContent.title }}</span>"
    {{ $t('notifications.material') }}
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ExpertReviewUserNotification',
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
      reviewerProfile() {
        return this.notification.metadata.reviewer;
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
          hash: '#reviews'
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
