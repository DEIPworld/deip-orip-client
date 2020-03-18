<template>
  <v-card class="pa-3 clickable user-notification" @click="clickNotification(notification)">
    <v-layout column align-space-between>
      <div>
        <span v-if="isAutoAccepted">
          <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span> excluded <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span> from "<span class="primary--text half-bold">{{notification.metadata.researchGroup.name}}</span>"
        </span>
        <span v-else-if="isAcceptedByQuorum">
          "<span class="primary--text half-bold">{{notification.metadata.researchGroup.name}}</span>" excluded <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span>
        </span>
        <span v-else>
          <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span> proposed to exclude <span class="primary--text half-bold">{{ excludedProfile | fullname }}</span> from "<span class="primary--text half-bold">{{notification.metadata.researchGroup.name}}</span>"
        </span>
      </div>
      <v-layout row justify-space-between align-end >
        <div class="grey--text caption pt-2">
          <v-icon size="16" color="grey">event</v-icon> {{ new Date(notification.created_at).toDateString() }}
        </div>
        <div>
          <a class="a orange--text caption" @click="markAsRead($event)">Mark as read</a>
        </div>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>

export default {
  name: "InviteProposalUserNotification",
  props: {
    notification: { type: Object, required: true }
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
  data() {
    return {
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
      this.$emit("markAsRead", this.notification);
    }
  }
};
</script>

<style lang="less">

</style>