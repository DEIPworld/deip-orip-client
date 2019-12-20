<template>
  <v-card class="pa-3 clickable user-notification" @click="clickNotification(notification)">
    <v-layout column align-space-between>
      <div>
        <span class="primary--text half-bold">{{ requestorProfile | fullname }}</span> requested you a review for "<span class="primary--text half-bold">{{notification.metadata.researchContent.title}}</span>" material
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
  name: "ExpertReviewRequestUserNotification",
  props: {
    notification: { type: Object, required: true }
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
  data() {
    return {
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
        }
      });

      // this.markAsRead();
    },

    markAsRead($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      // this.$emit("markAsRead", { notification: this.notification });
    }
  }
};
</script>

<style lang="less">

</style>