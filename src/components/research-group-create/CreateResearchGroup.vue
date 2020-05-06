<template>
  <v-container class="fill-height pa-0" fluid>
    <v-stepper v-model="currentStep" alt-labels class="display-flex flex-column w-100 fill-height stepper-page">
      <v-stepper-header class="flex-grow-0">
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="text-uppercase">
            Title
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="text-uppercase">
            Description
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="text-uppercase">
            Members
          </div>
        </v-stepper-step>

        <!-- <v-divider></v-divider>

        <v-stepper-step step="4" :complete="currentStep > 3">
            <div class="text-uppercase">Quorum</div>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5" :complete="currentStep > 4">
            <div class="text-uppercase">Tokens</div>
        </v-stepper-step> -->
      </v-stepper-header>

      <v-stepper-items class="flex-grow-1">
        <v-stepper-content step="1">
          <div class="fill-height">
            <create-research-group-title
              :group="group"
              @incStep="incStep"
              @setName="setName"
              @setPermlink="setPermlink"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="fill-height">
            <create-research-group-description
              :group="group"
              @incStep="incStep"
              @decStep="decStep"
              @setDescription="setDescription"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="fill-height">
            <create-research-group-members
              :group="group"
              :is-loading="isLoading"
              @setGroupMembers="setGroupMembers"
              @finish="finish"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <!-- <v-stepper-content step="4">
            <div class="fill-height">
                <create-research-group-quorum
                    @incStep="incStep" @decStep="decStep"
                    :group="group"
                ></create-research-group-quorum>
            </div>
        </v-stepper-content>

        <v-stepper-content step="5">
            <div class="fill-height">
                <create-research-group-share
                    @finish="finish" @decStep="decStep"
                    :group="group"
                    :isLoading="isLoading"
                ></create-research-group-share>
            </div>
        </v-stepper-content> -->
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'CreateResearchGroup',

    data() {
      return {
        currentStep: 1,
        isLoading: false,
        backRouterToken: undefined,

        group: {
          name: '',
          permlink: '',
          description: '',
          members: [],

          quorum: {
            startResearch: 0,
            inviteMembers: 0,
            dropoutMembers: 0,
            sendFunds: 0,
            startResearchTokenSale: 0,
            rebalanceGroupTokens: 0,
            changeQuorum: 0,
            changeReviewSharePercent: 0,
            offerResearchTokens: 0,
            createMaterial: 0,
            researchGroupMeta: 0,
            researchMeta: 0
          }
        }
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    created() {
      if (this.$route.query['back-token']) {
        try {
          this.backRouterToken = JSON.parse(this.$route.query['back-token']);
        } catch (e) {
          console.error('Invalid back router token');
        }
      }
    },
    methods: {
      incStep() { this.currentStep++; },
      decStep() { this.currentStep--; },

      setName(name) {
        this.group.name = name;
      },
      setPermlink(permlink) {
        this.group.permlink = permlink;
      },
      setDescription(description) {
        this.group.description = description;
      },
      setGroupMembers(members) {
        this.group.members = members;
      },

      finish() {
        this.isLoading = true;

        const invitees = this.group.members
          .filter((m) => m.account.name != this.user.username)
          .map((m) => ({
            account: m.account.name,
            rgt: m.stake * this.DEIP_1_PERCENT,
            notes: ''
          }));

        const creator = this.user.username;
        const memo = this.user.account.memo_key;
        const auth = {
          account_auths: [[creator, 1]],
          key_auths: [],
          weight_threshold: 1
        };

        researchGroupService.createResearchGroupViaOffchain(
          this.user.privKey,
          {
            fee: this.toAssetUnits(100),
            creator,
            accountOwnerAuth: auth,
            accountActiveAuth: auth,
            accountPostingAuth: auth,
            accountMemoPubKey: memo,
            accountJsonMetadata: '',
            accountExtensions: []
          },
          {
            researchGroupName: this.group.name,
            researchGroupPermlink: this.group.permlink,
            researchGroupDescription: this.group.description,
            // researchGroupInvitees: invitees,
            researchGroupThresholdOverrides: []
          }
        )
          .then((response) => {
            this.isLoading = false;
            this.$store.dispatch('auth/loadGroups'); // reload user groups
            this.$store.dispatch('layout/setSuccess', {
              message: `"${this.group.name}" research group has been created successfully !`
            });
            setTimeout(() => {
              if (!this.backRouterToken) {
                this.$router.push({
                  name: 'ResearchGroupDetails',
                  params: { research_group_permlink: encodeURIComponent(this.group.permlink) }
                });
              } else {
                if (this.backRouterToken.name === 'CreateResearch') {
                  this.backRouterToken.query.groupPermlink = this.group.permlink;
                }
                this.$router.push(this.backRouterToken);
              }
            }, 1500);
          }, (err) => {
            this.isLoading = false;
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating Research Group, please try again later'
            });
            console.log(err);
          });
      }
    }
  };
</script>

<style lang="less">
  .flex-column {
    flex-direction: column;
  }

  .flex-grow-0 {
    flex-grow: 0 !important;
  }

  .flex-grow-1 {
    flex-grow: 1 !important;
  }

  .w-100 {
    width: 100%;
  }

  .flex-basis-0 {
    flex-basis: 0 !important;
  }
</style>
