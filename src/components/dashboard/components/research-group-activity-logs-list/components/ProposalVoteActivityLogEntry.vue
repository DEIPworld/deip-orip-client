<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="grey"
          text-color="white"
        >
          <div class="log-label-chip-text">
            Proposal Vote
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <platform-avatar
          :user="{ profile: log.metadata.voterProfile, account: { name: log.metadata.voterProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        />
        <span>
          <span v-if="log.metadata.proposal.action == 1">
            approved "<span class="text-body-2">{{ log.metadata.proposal.data.title }}</span>" research start
          </span>
          <span v-else-if="log.metadata.proposal.action == 10">
            approved "<span class="text-body-2">{{ log.metadata.proposal.data.title }}</span>" material for "<router-link
              class="a"
              :to="{
                name: 'research.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
          </span>
          <span v-else-if="log.metadata.proposal.action == 5">
            approved fundraising campaign for "<router-link
              class="a"
              :to="{
                name: 'research.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
          </span>
          <span v-else-if="log.metadata.proposal.action == 2">
            approved invitation for <platform-avatar
              :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id} }"
              :size="20"
              link-to-profile
              link-to-profile-class="px-1"
            />
          </span>
          <span v-else>voted for proposal {{ log.metadata.proposal.id }}</span>
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
    name: 'ProposalVoteActivityLogEntry',
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
