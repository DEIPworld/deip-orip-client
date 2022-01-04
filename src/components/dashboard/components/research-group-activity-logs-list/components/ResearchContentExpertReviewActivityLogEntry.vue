<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="#7d4d86"
          text-color="white"
        >
          <div class="log-label-chip-text">
            Review
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <platform-avatar
          :user="{ profile: log.metadata.reviewerProfile, account: { name: log.metadata.reviewerProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        />
        <span>
          left a review for the "<router-link
            class="a"
            :to="{
              name: 'project.content.details',
              params: {
                projectId: log.metadata.project._id,
                contentId: log.metadata.projectContent._id
              }
            }"
          >{{ log.metadata.projectContent.title }}</router-link>" material
        </span>
      </div>
    </v-col>
    <v-col cols="2">
      <div class="grey--text text--right">
        {{ moment(log.created_at).format("DD MMM YYYY") }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ProjectContentExpertReviewActivityLogEntry',
    props: {
      log: { type: Object, required: true }
    },
    data() {
      return {
      };
    },
    computed: {

    },

    methods: {

    }
  };
</script>

<style lang="less" scoped>

</style>
