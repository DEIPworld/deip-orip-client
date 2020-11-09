<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="#76de96"
          text-color="white"
        >
          <div class="log-label-chip-text">
            Fundraising
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <span v-if="isAcceptedByQuorum">
          Fundraising campaign for the "<router-link
            class="a"
            :to="{
              name: 'project.details',
              params: {
                researchExternalId: log.metadata.research.external_id
              }
            }"
          >{{ log.metadata.research.title }}</router-link>" project was accepted by quorum
        </span>
        <span v-else>
          <platform-avatar
            :user="{ profile: log.metadata.creatorProfile, account: { name: log.metadata.creatorProfile._id} }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          />
          <span v-if="isAutoAccepted">
            scheduled fundraising campaign for the "<router-link
              class="a"
              :to="{
                name: 'project.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" project
          </span>
          <span v-else>
            proposed to schedule fundraising campaign for the "<router-link
              class="a"
              :to="{
                name: 'project.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" project
          </span>
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
    name: 'TokenSaleProposalActivityLogEntry',
    props: {
      log: { type: Object, required: true }
    },
    data() {
      return {
      };
    },
    computed: {
      isAcceptedByQuorum() {
        return this.log.metadata.researchGroup.is_dao && this.log.metadata.proposal.is_completed;
      },
      isAutoAccepted() {
        return !this.log.metadata.researchGroup.is_dao && this.log.metadata.isProposalAutoAccepted;
      }
    },

    methods: {

    }
  };
</script>

<style lang="less" scoped>

</style>
