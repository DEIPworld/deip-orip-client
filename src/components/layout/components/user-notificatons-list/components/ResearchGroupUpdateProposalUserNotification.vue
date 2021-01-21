<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <template v-if="isAutoAccepted">
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.updated') }}
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
      {{ $t('notifications.teamData') }}
    </template>
    <template v-else-if="isAcceptedByQuorum">
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
      {{ $t('notifications.updatedTeam') }}
    </template>
    <template v-else>
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.propUpdate') }}
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
      {{ $t('notifications.teamData') }}
    </template>
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'ResearchGroupUpdateProposalUserNotification',
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
        return this.notification.metadata.researchGroup.is_dao && this.notification.metadata.proposal.is_completed;
      },
      isAutoAccepted() {
        return !this.notification.metadata.researchGroup.is_dao && this.notification.metadata.isProposalAutoAccepted;
      },
      proposalCreator() {
        return this.notification.metadata.emitter;
      }
    },

    methods: {
      clickNotification() {
        if (this.isAcceptedByQuorum || this.isAutoAccepted) {
          this.$router.push({
            name: 'ResearchGroupDetails',
            params: {
              research_group_permlink: encodeURIComponent(this.notification.metadata.researchGroup.permlink)
            }
          });
        } else {
          this.$router.push({
            name: 'ResearchGroupDetails',
            params: {
              research_group_permlink: encodeURIComponent(this.notification.metadata.researchGroup.permlink)
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
