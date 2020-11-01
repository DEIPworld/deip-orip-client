<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="blue"
          text-color="white"
        >
          <div class="log-label-chip-text">
            New Material
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <span v-if="isAcceptedByQuorum">
          <span>
            New "<router-link
              class="a"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink),
                  content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
                }
              }"
            >{{ log.metadata.researchContent.title }}</router-link>"
            material was accepted for the "<router-link
              class="a"
              :to="{
                name: 'research.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research by quorum
          </span>
        </span>

        <span v-else>
          <platform-avatar
            :user="{ profile: log.metadata.creatorProfile, account: { name: log.metadata.creatorProfile._id} }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          />
          <span v-if="isAutoAccepted">
            uploaded new "<router-link
              class="a"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(log.metadata.researchGroup.permlink),
                  research_permlink: encodeURIComponent(log.metadata.research.permlink),
                  content_permlink: encodeURIComponent(log.metadata.researchContent.permlink)
                }
              }"
            >{{ log.metadata.researchContent.title }}</router-link>"
            material for the "<router-link
              class="a"
              :to="{
                name: 'research.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
          </span>
          <span v-else>
            proposed a new "<span class="text-body-2">{{ log.metadata.proposal.data.title }}</span>" material for the "<router-link
              class="a"
              :to="{
                name: 'research.details',
                params: {
                  researchExternalId: log.metadata.research.external_id
                }
              }"
            >{{ log.metadata.research.title }}</router-link>" research
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
    name: 'ResearchContentProposalActivityLogEntry',
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
