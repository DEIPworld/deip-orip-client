<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ requestorProfile | fullname }}</span>
    {{ $t('notifications.requestedReview') }}
    "<span class="primary--text half-bold">{{ notification.metadata.researchContent.title }}</span>"
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
        return {
          profile: this.notification.metadata.expertProfile,
          account: {
            name: this.notification.metadata.expertProfile._id
          }
        };
      },
      requestorProfile() {
        return {
          profile: this.notification.metadata.requestorProfile,
          account: {
            name: this.notification.metadata.requestorProfile._id
          }
        };
      }
    },

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'project.content.details',
          params: {
            researchExternalId: this.notification.metadata.research.external_id,
            contentExternalId: this.notification.metadata.researchContent.external_id
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
