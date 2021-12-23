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
        <platform-avatar
          :user="{ profile: log.metadata.inviteeProfile, account: { name: log.metadata.inviteeProfile._id} }"
          :size="20"
          link-to-profile
          link-to-profile-class="px-1"
        />
        <span>
          rejected invitation to the "<router-link
            class="a"
            :to="{
              name: 'team.details',
              params: {
                teamId: log.metadata.team._id,
              }
            }"
          >{{ log.metadata.team.name }}</router-link>"
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
    name: 'InvitationRejectedActivityLogEntry',
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
