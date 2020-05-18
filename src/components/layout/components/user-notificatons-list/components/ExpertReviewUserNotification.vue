<template>
  <v-sheet @click="clickNotification(notification)">
    <div>
      <span class="primary--text half-bold">{{ reviewerProfile | fullname }}</span> left a review for "<span class="primary--text half-bold">{{ notification.metadata.researchContent.title }}</span>" material
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
    name: 'ExpertReviewUserNotification',
    props: {
      notification: { type: Object, required: true }
    },
    data() {
      return {
      };
    },
    computed: {
      reviewerProfile() {
        return {
          profile: this.notification.metadata.reviewerProfile,
          account: {
            name: this.notification.metadata.reviewerProfile._id
          }
        };
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
          },
          hash: '#reviews'
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
