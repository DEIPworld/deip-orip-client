<template>
  <v-layout>
    <v-flex xs2>
      <div>
        <v-chip block small color="#76de96" text-color="white">Fundraising</v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <v-layout align-baseline px-3>
        <platform-avatar 
          :user="{ profile: log.metadata.creatorProfile, account: { name: log.metadata.creatorProfile._id} }"
          :size="30"
          link-to-profile
          link-to-profile-class="px-2"
        ></platform-avatar>

        <span v-if="log.metadata.isProposalAutoAccepted">
          scheduled fundraising campaign for "<router-link class="a"
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
          proposed to schedule fundraising campaign for "<router-link class="a"
            :to="{
              name: 'ResearchDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                research_permlink: encodeURIComponent(log.metadata.research.permlink)
              }
            }"
          >{{ log.metadata.research.title }}</router-link>" research
        </span>
      </v-layout>
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
  name: "TokenSaleProposalActivityLogEntry",
  props: {
    log: { type: Object, required: true }
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

.group-activity-log {
  border-top: 1px solid @grey-lighten-2;
  border-bottom: 1px solid @grey-lighten-2;
}

</style>
