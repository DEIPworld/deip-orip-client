<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <template v-if="isAutoAccepted">
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.uploadedNew') }}
      "<span class="primary--text half-bold">
        {{ notification.metadata.projectContent.title }}
      </span>"
      {{ $t('notifications.materialIn') }}
      "<span class="primary--text half-bold">{{ notification.metadata.project.title }}</span>"
      {{ $t('notifications.project') }}
    </template>
    <template v-else-if="isAcceptedByQuorum">
      "<span class="primary--text half-bold">{{ notification.metadata.team.name }}</span>"
      {{ $t('notifications.acceptedNew') }}
      "<span class="primary--text half-bold">
        {{ notification.metadata.projectContent.title }}
      </span>"
      {{ $t('notifications.materialIn') }}
      "<span class="primary--text half-bold">{{ notification.metadata.project.title }}</span>"
      {{ $t('notifications.project') }}
    </template>
    <template v-else>
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.propUpload') }}
      "<span class="primary--text half-bold">{{ notification.metadata.proposal.data.title }}</span>"
      {{ $t('notifications.materialFor') }}
      "<span class="primary--text half-bold">{{ notification.metadata.project.title }}</span>"
      {{ $t('notifications.projectIn') }}
      <!-- "<span class="primary--text half-bold">{{ notification.metadata.team.name }}</span>" -->
    </template>
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ProjectContentProposalUserNotification',
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
      isAcceptedByQuorum() {
        return this.notification.metadata.team.is_dao && this.notification.metadata.proposal.is_completed;
      },
      isAutoAccepted() {
        return !this.notification.metadata.team.is_dao && this.notification.metadata.isProposalAutoAccepted;
      },
      proposalCreator() {
        return this.notification.metadata.emitter;
      }
    },

    methods: {
      clickNotification() {
        if (this.isAcceptedByQuorum || this.isAutoAccepted) {
          this.$router.push({
            name: 'project.content.details',
            params: {
              projectId: this.notification.metadata.project._id,
              contentId: this.notification.metadata.projectContent._id
            }
          });
        } else {
          this.$router.push({
            name: 'team.details',
            params: {
              teamId: this.notification.metadata.team._id
            },
            hash: '#proposals'
          });
        }

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
