<template>
  <v-layout>
    <v-flex xs2>
      <div>
        <v-chip block small color="blue" text-color="white">Invite</v-chip>
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
          invited <router-link class="a"
            :to="{
              name: 'UserDetails',
              params: {
                account_name: encodeURIComponent(log.metadata.inviteeProfile._id)
              }
            }"
          >{{ { profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id} } | fullname }}</router-link>
          to "<router-link class="a"
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink)
              }
            }"
          >{{ log.metadata.researchGroup.name }}</router-link>"
        </span>
        <span v-else>
          proposed to invite <router-link class="a"
            :to="{
              name: 'UserDetails',
              params: {
                account_name: encodeURIComponent(log.metadata.inviteeProfile._id)
              }
            }"
          >{{ { profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id} } | fullname }}</router-link>
          to "<router-link class="a"
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
              }
            }"
          >{{ log.metadata.researchGroup.name }}</router-link>"
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
  name: "InviteProposalActivityLogEntry",
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
