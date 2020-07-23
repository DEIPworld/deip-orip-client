<template>
  <v-dialog
    v-model="isOpen"
    persistent
    transition="scale-transition"
    max-width="600px"
  >
    <v-card class="pa-6">
      <v-card-title>
        <div class="text-h5">
          Invite user to Research Group
        </div>
        <div class="right-top-angle">
          <v-btn icon class="pa-0 ma-0" @click="close()">
            <v-icon color="black">
              close
            </v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedUser"
          :items="users"
          outlined dense
          item-text="profile.firstName"
          item-value="account"
          placeholder="Researcher"
        >
          <template slot="selection" slot-scope="data">
            <div class="pl-2">
              <platform-avatar
                :user="data.item"
                :size="30"
                no-follow
                no-follow-name
                link-to-profile-class="pl-2"
              />
            </div>
          </template>

          <template slot="item" slot-scope="data">
            <div>
              <platform-avatar
                :user="data.item"
                :size="30"
                no-follow
                no-follow-name
                link-to-profile-class="pl-2"
              />
            </div>
          </template>
        </v-autocomplete>

        <!-- <v-text-field
          v-model="tokensAmount"
          outlined dense
          label="Research Group Tokens"
          suffix="%"
          mask="###"
        /> -->

        <v-textarea
          v-model="coverLetter"
          label="Invitation letter"
          auto-grow
          outlined dense
          rows="2"
        />
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="py-2" cols="12">
            <v-btn
              color="primary"
              :disabled="isDisabled || isLoading"
              :loading="isLoading"
              block
              @click="sendProposal()"
            >
              Create proposal
            </v-btn>
          </v-col>
          <v-col class="py-2" cols="12">
            <v-btn
              :disabled="isLoading"
              color="primary"
              text
              block
              @click="close()"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'AddMemberToGroupDialog',

    props: {
      isOpen: { required: true, type: Boolean },
      groupExternalId: { required: true, type: String },
      users: { required: true, type: Array, default: () => [] }
    },
    data() {
      return {
        selectedUser: undefined,
        tokensAmount: '',
        coverLetter: '',
        isLoading: false
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      isDisabled() {
        return _.isEmpty(this.selectedUser)
          // || _.isEmpty(this.tokensAmount)
          || !_.isNumber(parseInt(this.tokensAmount));
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        this.selectedUser = undefined;
        this.tokensAmount = '';
        this.coverLetter = '';
      }
    },
    methods: {
      close() {
        this.$emit('onClose');
      },

      sendProposal() {
        this.isLoading = true;

        researchGroupService.createResearchGroupInviteViaOffchain(this.user.privKey, {
          researchGroup: this.groupExternalId,
          member: this.selectedUser.name,
          rewardShare: `0.00 %`,
          researches: undefined, // all researches
          extensions: [],
        }, {
          notes: this.coverLetter,
          approver: null
        })
        .then(() => {
          this.$notifier.showSuccess(`Invitation Proposal has been created successfully!`)
          this.$emit('onSuccess');
        }).catch((err) => {
          this.$notifier.showError(`An error occurred while creating proposal, please try again later`)
          console.error(err);
        }).finally(() => {
          this.isLoading = false;
          this.close();
        });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
