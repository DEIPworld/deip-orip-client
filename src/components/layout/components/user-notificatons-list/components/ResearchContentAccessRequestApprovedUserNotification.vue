<template>
  <v-card class="pa-3 clickable user-notification" @click="clickNotification(notification)">
    <v-layout column align-space-between>
      <div>
        <span class="primary--text half-bold">{{ approverProfile | fullname }}</span> <span class="primary--text half-bold uppercase">({{approverRole}})</span> {{ isAccessGranted ? 'granted access' : 'approved access request' }} to "<span class="primary--text half-bold">{{notification.metadata.researchContent.title}}</span>" material for <span class="primary--text half-bold">{{ requestorProfile | fullname }}</span> 
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
  name: "ResearchContentAccessRequestApprovedUserNotification",
  props: {
    notification: { type: Object, required: true }
  },
  computed: {
    approverProfile() {
      return {
        profile: this.notification.metadata.approverProfile, 
        account: { 
          name: this.notification.metadata.approverProfile._id
        }
      };
    },
    requestorProfile() {
      return {
        profile: this.notification.metadata.researchContentAccessRequest.metadata.userProfile, 
        account: { 
          name: this.notification.metadata.researchContentAccessRequest.metadata.userProfile._id
        }
      };
    },
    isAccessGranted() {
      return this.notification.metadata.isAccessGranted === true;
    },
    approverRole() {
      return this.notification.metadata.role;
    },
    requestorAgency() {
      return this.notification.metadata.researchContentAccessRequest.metadata.userAgency.name;
    }
  },
  data() {
    return {
    }
  },

  methods: {
    clickNotification() {

      if (this.isAccessGranted) {
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
          name: 'Dashboard',
          hash: '#access-requests'
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