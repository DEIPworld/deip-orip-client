<template>
  <v-sheet @click="clickNotification(notification)">
    <div>
      "<span class="primary--text half-bold">{{ notification.metadata.researchGroup.name }}</span>" excluded you from members list
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
    name: 'InvitationUserNotification',
    props: {
      notification: { type: Object, required: true }
    },
    data() {
      return {
      };
    },
    computed: {
    },

    methods: {
      clickNotification() {
        this.$router.push({
          name: 'UserDetails',
          params: {
            account_name: encodeURIComponent(this.notification.metadata.excludedProfile._id)
          },
          hash: '#invites'
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
