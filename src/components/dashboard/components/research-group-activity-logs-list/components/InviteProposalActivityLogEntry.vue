<template>
  <v-row align="center">
    <v-col cols="2">
      <div>
        <v-chip
          class="log-label-chip"
          small
          color="orange"
          text-color="white"
        >
          <div class="log-label-chip-text">
            Invite
          </div>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="align-baseline px-4">
        <span v-if="isAcceptedByQuorum">
          Invitation for <platform-avatar
            :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id } }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          />
          was accepted by quorum and sent to the invitee
        </span>
        <span v-else>
          <platform-avatar
            :user="{ profile: log.metadata.creatorProfile, account: { name: log.metadata.creatorProfile._id} }"
            :size="20"
            link-to-profile
            link-to-profile-class="px-1"
          />
          <span v-if="isAutoAccepted">
            invited <platform-avatar
              :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id } }"
              :size="20"
              link-to-profile
              link-to-profile-class="px-1"
            />
            to the "<router-link
              class="a"
              :to="{
                name: 'team.details',
                params: {
                  teamId: log.metadata.researchGroup.external_id
                }
              }"
            >{{ log.metadata.researchGroup.name }}</router-link>"
          </span>
          <span v-else>
            proposed to invite <platform-avatar
              :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id } }"
              :size="20"
              link-to-profile
              link-to-profile-class="px-1"
            />
            to the "<router-link
              class="a"
              :to="{
                name: 'team.details',
                params: {
                  teamId: log.metadata.researchGroup.external_id,
                }
              }"
            >{{ log.metadata.researchGroup.name }}</router-link>"
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
    name: 'InviteProposalActivityLogEntry',
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
