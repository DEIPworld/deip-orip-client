<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <span class="primary--text half-bold">{{ reviewerProfile | fullname }}</span>
    left a review for
    "<span class="primary--text half-bold">{{ notification.metadata.researchContent.title }}</span>"
    material
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
        return {
          profile: this.notification.metadata.reviewerProfile,
          account: {
            name: this.notification.metadata.reviewerProfile._id
          }
        };
      }
    },

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'ResearchContentDetails',
          params: {
            research_group_permlink: encodeURIComponent(this.notification.metadata.researchGroup.permlink),
            research_permlink: encodeURIComponent(this.notification.metadata.research.permlink),
            content_permlink: encodeURIComponent(this.notification.metadata.researchContent.permlink)
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
