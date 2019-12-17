<template>
  <v-layout align-baseline align-center>
    <v-flex xs2>
      <div>
        <v-chip class="log-label-chip" small color="#7d4d86" text-color="white">
          <div class="log-label-chip-text">Review</div>
        </v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <div class="align-baseline px-3">
        <platform-avatar 
          :user="{ profile: log.metadata.reviewerProfile, account: { name: log.metadata.reviewerProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        ></platform-avatar>
        <span>
          left a review for the "<router-link class="a"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                research_permlink: encodeURIComponent(log.metadata.research.permlink),
                content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
              }
            }"
          >{{ log.metadata.researchContent.title }}</router-link>" material
        </span>
      </div>
    </v-flex>
    <v-flex xs2>
      <div class="grey--text text-xs-right">
        {{ moment(log.created_at).format("DD MMM YYYY") }}
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "ResearchContentExpertReviewActivityLogEntry",
  props: {
    log: { type: Object, required: true }
  },
  computed: {

  },
  data() {
    return {
    }
  },

  methods: {

  }
};
</script>

<style lang="less" scoped>

@import "./../../../../styles/colors.less";

</style>
