<template>
  <v-layout align-baseline align-center>
    <v-flex xs2>
      <div>
        <v-chip class="log-label-chip" small color="orange" text-color="white">
          <div class="log-label-chip-text">Invite</div>
        </v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <div class="align-baseline px-3">
        <platform-avatar 
          :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        ></platform-avatar>
        <span>
          accepted invitation and now is a member of the "<router-link class="a"
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
              }
            }"
          >{{ log.metadata.researchGroup.name }}</router-link>"
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
  name: "InvitationApprovedActivityLogEntry",
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
