<template>
  <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="600px">
    <v-card class="pa-4">
      <v-card-title>
        <v-layout align-center>
          <v-flex grow headline>Invite user to Research Group</v-flex>
          <v-flex shrink right-top-angle>
            <v-btn @click="close()" icon class="pa-0 ma-0">
              <v-icon color="black">close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-autocomplete :items="users" item-text="profile.firstName" item-value="account" v-model="selectedUser"
                        placeholder="Researcher">
          <template slot="selection" slot-scope="data">
            <div class="pl-2">
              <platform-avatar
                :user="data.item"
                :size="30"
                noFollow
                noFollowName
                link-to-profile-class="pl-2"
              ></platform-avatar>
            </div>
          </template>

          <template slot="item" slot-scope="data">
            <div>
              <platform-avatar
                :user="data.item"
                :size="30"
                noFollow
                noFollowName
                link-to-profile-class="pl-2"
              ></platform-avatar>
            </div>
          </template>
        </v-autocomplete>

        <v-text-field label="Research Group Tokens" v-model="tokensAmount" suffix="%" mask="###"></v-text-field>

        <v-textarea label="Invitation letter" auto-grow rows="2" v-model="coverLetter"></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-layout row wrap>
          <v-flex xs12 py-2>
            <v-btn
              color="primary"
              :disabled="isDisabled || isLoading"
              :loading="isLoading"
              @click="sendProposal()"
              block
            >Create proposal
            </v-btn>
          </v-flex>
          <v-flex xs12 py-2>
            <v-btn
              @click="close()"
              :disabled="isLoading"
              color="primary"
              flat
              block>Cancel
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'AddMemberToGroupDialog',

    props: {
      isOpen: { required: true, type: Boolean },
      groupId: { required: true, type: Number },
      users: { required: true, type: Array, default: () => [] },
    },
    computed: {
      isDisabled() {
        return _.isEmpty(this.selectedUser)
          || _.isEmpty(this.tokensAmount)
          || !_.isNumber(parseInt(this.tokensAmount));
      }
    },
    data() {
      return {
        selectedUser: undefined,
        tokensAmount: '',
        coverLetter: '',
        isLoading: false
      }
    },
    methods: {
      close() {
        this.$emit('onClose');
      },

      sendProposal() {
        this.isLoading = true;

        researchGroupService.createInviteProposal({
          groupId: this.groupId,
          invitee: this.selectedUser.name,
          rgtAmount: parseInt(this.tokensAmount) * this.DEIP_1_PERCENT,
          coverLetter: this.coverLetter,
          isHead: false
        }).then(() => {
          this.$store.dispatch('layout/setSuccess', {
            message: 'Invitation Proposal has been created successfully!'
          });
          this.$emit('onSuccess');
        }).catch(err => {
          this.$store.dispatch('layout/setError', {
            message: 'An error occurred while creating proposal, please try again later'
          });
          console.log(err)
        }).finally(() => {
          this.isLoading = false;
          this.close();
        });
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        this.selectedUser = undefined;
        this.tokensAmount = '';
        this.coverLetter = '';
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
