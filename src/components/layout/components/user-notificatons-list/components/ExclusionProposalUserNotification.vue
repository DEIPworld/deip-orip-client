<template>
  <user-notifications-list-item
    :date="notification.created_at"
    @mark-as-read="markAsRead($event)"
    @click="clickNotification(notification)"
  >
    <template v-if="isAutoAccepted">
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.excluded') }}
      <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span>
      {{ $t('notifications.from') }}
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
    </template>
    <template v-else-if="isAcceptedByQuorum">
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
      {{ $t('notifications.excluded') }}
      <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span>
    </template>
    <template v-else>
      <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
      {{ $t('notifications.propExclude') }}
      <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span>
      {{ $t('notifications.from') }}
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
    </template>
  </user-notifications-list-item>
</template>

<script>

  import UserNotificationsListItem
    from '@/components/layout/components/user-notificatons-list/UserNotificationsListItem';

  export default {
    name: 'InviteProposalUserNotification',
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
        return {
          profile: this.notification.metadata.creatorProfile,
          account: {
            name: this.notification.metadata.creatorProfile._id
          }
        };
      },
      excludedProfile() {
        return {
          profile: this.notification.metadata.excludedProfile,
          account: {
            name: this.notification.metadata.excludedProfile._id
          }
        };
      }
    },

    methods: {
      clickNotification() {
        if (this.isAcceptedByQuorum || this.isAutoAccepted) {
          this.$router.push({
            name: 'UserDetails',
            params: {
              account_name: encodeURIComponent(this.notification.metadata.excludedProfile._id)
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
