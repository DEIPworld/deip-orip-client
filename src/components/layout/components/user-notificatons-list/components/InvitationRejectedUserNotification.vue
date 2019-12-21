<template>
  <v-card class="pa-3 clickable user-notification" @click="clickNotification(notification)">
    <v-layout column align-space-between>
      <div>
        <span class="primary--text half-bold">{{ inviteeProfile | fullname }}</span> declined invitation to "<span class="primary--text half-bold">{{notification.metadata.researchGroup.name}}</span>"
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
  name: "InvitationRejectedUserNotification",
  props: {
    notification: { type: Object, required: true }
  },
  computed: {
    inviteeProfile() {
      return {
        profile: this.notification.metadata.inviteeProfile, 
        account: { 
          name: this.notification.metadata.inviteeProfile._id
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
        name: 'UserDetails', 
        params: { 
          account_name: encodeURIComponent(this.notification.metadata.inviteeProfile._id)
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