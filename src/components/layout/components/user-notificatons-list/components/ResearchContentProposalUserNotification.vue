<template>
  <v-sheet @click="clickNotification(notification)">
    <div>
      <span v-if="isAutoAccepted">
        <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
        uploaded new
        "<span class="primary--text half-bold">{{ notification.metadata.researchContent.title }}</span>"
        material in
        "<span class="primary--text half-bold">{{ notification.metadata.research.title }}</span>"
        research
      </span>
      <span v-else-if="isAcceptedByQuorum">
        "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
        accepted new
        "<span class="primary--text half-bold">{{ notification.metadata.researchContent.title }}</span>"
        material in
        "<span class="primary--text half-bold">{{ notification.metadata.research.title }}</span>"
        research
      </span>
      <span v-else>
        <span class="primary--text half-bold">{{ proposalCreator | fullname }}</span>
        proposed to upload
        "<span class="primary--text half-bold">{{ notification.metadata.proposal.data.title }}</span>"
        material for
        "<span class="primary--text half-bold">{{ notification.metadata.research.title }}</span>"
        research in
        "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>"
      </span>
    </div>
    <v-row justify="space-between" align="end">
      <v-col class="grey--text caption">
        <v-icon size="16" color="grey">
          event
        </v-icon>
        {{ new Date(notification.created_at).toDateString() }}
      </v-col>
      <v-col cols="auto">
        <a class="a orange--text caption" @click="markAsRead($event)">Mark as read</a>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>

  export default {
    name: 'ResearchProposalUserNotification',
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
      }
    },

    methods: {
      clickNotification() {
        if (this.isAcceptedByQuorum || this.isAutoAccepted) {
          this.$router.push({
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: encodeURIComponent(this.notification.metadata.researchGroup.permlink),
              research_permlink: encodeURIComponent(this.notification.metadata.research.permlink),
              content_permlink: encodeURIComponent(this.notification.metadata.researchContent.permlink)
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
