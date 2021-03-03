<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <template v-if="$currentUser.username !== notification.metadata.creator.username">
      {{ $t('notifications.accessTo') }}
      <span class="primary--text half-bold">'{{ notification.metadata.research.title }}'</span>
      {{ $t('notifications.grantedTo') }}
      <span class="primary--text half-bold">{{ notification.metadata.creator | fullname }}</span>
      {{ $t('notifications.from') }}
      <span class="primary--text half-bold">
        '{{ notification.metadata.tenant.profile.shortName }}'
      </span>
    </template>
    <template v-else>
      {{ $t('notifications.accessTo') }}
      <span class="primary--text half-bold">'{{ notification.metadata.research.title }}'</span>
      {{ $t('notifications.granted') }}
    </template>
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ResearchNdaSignedNotification',
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
