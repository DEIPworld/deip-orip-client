<template>
  <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="600px">
    <v-card class="pa-4">
      <v-card-title>
        <v-layout row align-center align-baseline>
          <v-flex grow class="headline">
            Join Request
          </v-flex>
          <v-flex shrink align-self-center right-top-angle>
            <v-btn @click="close()" icon class="pa-0 ma-0">
              <v-icon color="black">close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <div>
          <platform-avatar :user="joinRequest.user" :size="80" link-to-profile
                           link-to-profile-class="pl-4 title"></platform-avatar>
        </div>
        <div class="py-4">{{joinRequest.coverLetter}}</div>

        <v-text-field
          label="Research Group Tokens"
          v-model="tokensAmount"
          suffix="%"
          mask="##"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-layout row wrap>
          <v-flex xs12 py-2>
            <v-btn
              color="primary"
              block
              :disabled="isApprovingDisabled || isApprovingLoading"
              :loading="isApprovingLoading"
              @click="sendProposal()"
            >Approve and create proposal
            </v-btn>
          </v-flex>
          <v-flex xs12 py-2>
            <v-btn
              color="primary"
              flat
              block
              @click="denyJoinRequest()"
              :loading="isDenyingLoading"
              :disabled="isDenyingLoading || isApprovingLoading"
            >Reject
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // import deipRpc from '@deip/deip-oa-rpc-client';

  import _ from 'lodash';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'HandleJoinRequestDialog',

    props: {
      isOpen: { required: true, type: Boolean },
      groupId: { required: true, type: Number },
      joinRequest: {
        required: true,
        validator(value) {
          return value === undefined || typeof value === 'object';
        }
      }
    },
    computed: {
      isApprovingDisabled() {
        return _.isEmpty(this.tokensAmount) || !_.isNumber(parseInt(this.tokensAmount));
      },
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
        tokensAmount: undefined,
        coverLetter: '',

        isApprovingLoading: false,
        isDenyingLoading: false
      }
    },
    methods: {
      close() {
        this.$emit('onClose');
      },

      sendProposal() {
        const amount = parseInt(this.tokensAmount) * this.DEIP_1_PERCENT
        this.isApprovingLoading = true;
        researchGroupService.createInviteProposal({
          groupId: this.groupId,
          invitee: this.joinRequest.username,
          rgtAmount: amount,
          coverLetter: this.coverLetter,
        }).then(() => {
          this.$store.dispatch('researchGroup/loadJoinRequests', { groupId: this.groupId });
          this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.groupId });
          this.$store.dispatch('layout/setSuccess', { message: `Invite proposal for "${this.joinRequest.username}" has been created successfully !` });
        }, (err) => {
          this.$store.dispatch('layout/setError', { message: 'An error occurred while approving join request, please try again later' });
          console.log(err)
        })
          .finally(() => {
            this.isApprovingLoading = false;
            this.close();
          })
      },

      denyJoinRequest() {
        const self = this;
        const update = Object.assign({}, self.joinRequest, { status: 'denied' });
        self.isDenyingLoading = true;

        researchGroupService.updateJoinRequest({ request: update })
          .then((updatedRequest) => {
              self.$store.dispatch('researchGroup/loadJoinRequests', { groupId: self.groupId });
              self.$store.dispatch('layout/setSuccess', { message: `You have denied join request from  "${self.joinRequest.username}" successfully !` });

              setTimeout(() => self.close(), 500);
            },
            (err) => {
              self.$store.dispatch('layout/setError', { message: 'An error occurred while denying join request, please try again later' });
              console.log(err)
            }
          )
          .finally(() => {
            self.isDenyingLoading = false;
          })
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        if (newVal) {
          this.tokensAmount = undefined;
          this.coverLetter = this.joinRequest.coverLetter;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
