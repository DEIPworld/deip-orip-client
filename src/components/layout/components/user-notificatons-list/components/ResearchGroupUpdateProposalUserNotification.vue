<template>
  <v-sheet @click="clickNotification(notification)">
    <div>
      <span v-if="isAutoAccepted">
        <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span> updated "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>" team data
      </span>
      <span v-else-if="isAcceptedByQuorum">
        "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>" updated team data
      </span>
      <span v-else>
        <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span> proposed to update "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>" team data
      </span>
    </div>
    <v-row justify="space-between" align="end">
      <v-col class="grey--text caption">
        <v-icon size="16" color="grey">
          event
        </v-icon> {{ new Date(notification.created_at).toDateString() }}
      </v-col>
      <v-col cols="auto">
        <a class="a orange--text caption" @click="markAsRead($event)">Mark as read</a>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>

  export default {
    name: 'ResearchGroupUpdateProposalUserNotification',
    props: {
      notification: { type: Object, required: true }
    },
    data() {
      return {
      };
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
