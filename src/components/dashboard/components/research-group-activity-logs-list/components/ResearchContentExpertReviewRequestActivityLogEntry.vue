<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="cyan"
          text-color="white"
        >
          <div class="log-label-chip-text">
            Review Request
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <platform-avatar
          :user="{ profile: log.metadata.requestorProfile, account: { name: log.metadata.requestorProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        />
        <span>
          requested an expert review for the "<router-link
            class="a"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                research_permlink: encodeURIComponent(log.metadata.research.permlink),
                content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
              }
            }"
          >{{ log.metadata.researchContent.title }}</router-link>" material from <platform-avatar
            :user="{ profile: log.metadata.expertProfile, account: { name: log.metadata.expertProfile._id} }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          />
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
    name: 'ResearchContentExpertReviewRequestActivityLogEntry',
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
