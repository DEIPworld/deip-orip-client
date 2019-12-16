<template>
  <v-layout align-baseline align-center>
    <v-flex xs2>
      <div>
        <v-chip class="log-label-chip" small color="#3f51b5" text-color="white">
          <div class="log-label-chip-text">New Research</div>
        </v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <div class="align-baseline px-3">
        <span v-if="isAcceptedByQuorum">
          <span>
            New "<router-link class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink)
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research was accepted by quorum
          </span>
        </span>
        <span v-else>
          <platform-avatar
            :user="{ profile: log.metadata.creatorProfile, account: { name: log.metadata.creatorProfile._id} }"
            :size="25"
            link-to-profile
            link-to-profile-class="px-1"
          ></platform-avatar>
          <span v-if="isAutoAccepted">
            started "<router-link class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink)
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
          </span>
          <span v-else>
            proposed to start "<span class="body-2">{{log.metadata.proposal.data.title}}</span>" research
          </span>
        </span>
      </div>
    </v-flex>
    <v-flex xs2>
      <div class="grey--text text-xs-right">
        {{ moment(log.created_at).format("DD, MMM YYYY") }}
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "ResearchProposalActivityLogEntry",
  props: {
    log: { type: Object, required: true }
  },
  computed: {
    isAcceptedByQuorum() {
      return this.log.metadata.researchGroup.is_dao && this.log.metadata.proposal.is_completed;
    },
    isAutoAccepted() {
      return !this.log.metadata.researchGroup.is_dao && this.log.metadata.isProposalAutoAccepted;
    }
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
