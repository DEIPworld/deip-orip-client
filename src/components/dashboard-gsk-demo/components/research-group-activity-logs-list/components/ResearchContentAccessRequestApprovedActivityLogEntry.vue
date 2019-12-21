<template>
  <v-layout align-baseline align-center>
    <v-flex xs2>
      <div>
        <v-chip class="log-label-chip" small color="green" text-color="white">
          <div class="log-label-chip-text">{{ log.metadata.role == 'pi' ? 'Access Approved': 'Access Granted' }}</div>
        </v-chip>
      </div>
    </v-flex>
    <v-flex xs8>
      <div class="align-baseline px-3">
        <platform-avatar 
          :user="{ profile: log.metadata.approverProfile, account: { name: log.metadata.approverProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        ><span class="grey--text uppercase half-bold">({{log.metadata.role}})</span>
        </platform-avatar>
        <span>
          {{ log.metadata.isAccessGranted ? 'granted access' : 'approved access request' }} to "<router-link class="a"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                research_permlink: encodeURIComponent(log.metadata.research.permlink),
                content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
              }
            }"
          >{{ log.metadata.researchContent.title }}</router-link>" material in "<router-link class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink)
                }
              }"
          >{{ log.metadata.research.title }}</router-link>" research for
          <platform-avatar 
            :user="{ profile: log.metadata.researchContentAccessRequest.metadata.userProfile, account: { name: log.metadata.researchContentAccessRequest.metadata.userProfile._id} }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          ><span class="half-bold primary--text">({{log.metadata.researchContentAccessRequest.metadata.userAgency.name}})</span></platform-avatar>
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
  name: "ResearchContentAccessRequestApprovedActivityLogEntry",
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

</style>
