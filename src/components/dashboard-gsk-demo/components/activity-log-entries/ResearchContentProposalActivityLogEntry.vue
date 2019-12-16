<template>
  <v-layout align-baseline align-center>
    <v-flex xs2>
      <div>
        <v-chip block small color="#ff9800" text-color="white">New Material</v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <div class="align-baseline px-3">
        <span v-if="isAcceptedByQuorum">
          <span>
            New "<router-link class="a"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink),
                  content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
                }
              }"
            >{{ log.metadata.researchContent.title }}</router-link>"
            material was accepted for the "<router-link class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink)
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research by quorum
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
            uploaded new "<router-link class="a"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink),
                  content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
                }
              }"
            >{{ log.metadata.researchContent.title }}</router-link>"
            material for the "<router-link class="a"
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
            proposed a new "<span class="body-2">{{log.metadata.proposal.data.title}}</span>" material for the "<router-link class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink)
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
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
  name: "ResearchContentProposalActivityLogEntry",
  props: {
    log: { type: Object, required: true },
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
