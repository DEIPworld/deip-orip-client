<template>
  <v-container fluid fill-height pa-0>
    <v-layout>
      <v-stepper v-model="currentStep" alt-labels class="display-flex flex-column w-100 fill-height stepper-page">
        <v-stepper-header class="flex-grow-0">
          <v-stepper-step step="1" :complete="currentStep > 1">
            <div class="text-uppercase">Title</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="2" :complete="currentStep > 2">
            <div class="text-uppercase">Description</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :complete="currentStep > 3">
            <div class="text-uppercase">Members</div>
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
                @incStep="incStep"
                :group="group"
                @setName="setName"
                @setPermlink="setPermlink"
              ></create-research-group-title>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="fill-height">
              <create-research-group-description
                @incStep="incStep" @decStep="decStep"
                @setDescription="setDescription"
                :group="group"
              ></create-research-group-description>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div class="fill-height">
              <create-research-group-members
                @setGroupMembers="setGroupMembers"
                @finish="finish" @decStep="decStep"
                :group="group"
                :isLoading="isLoading"
              ></create-research-group-members>
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
    </v-layout>
  </v-container>
</template>

<script>
  // import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'CreateResearchGroup',

    data() {
      return {
        currentStep: 0,
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
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
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
          .filter(m => m.account.name != this.user.username)
          .map(m => {
            return {
              account: m.account.name,
              research_group_tokens_in_percent: m.stake * this.DEIP_1_PERCENT,
              cover_letter: ''
            }
          });

        for (let key in this.group.quorum) {
          this.group.quorum[key] = 50;
        }
        const maxProposalPercent = _(this.group.quorum).values().maxBy(item => parseInt(item));
        const proposalQuorums = _.keys(this.group.quorum).map((item, i) => {
          // as a result we should get array of arrays [proposalType, percents], `i` almost matches proposalType
          return [
            i + 1,
            parseInt(this.group.quorum[item]) * this.DEIP_1_PERCENT
          ]
        });
        researchGroupService.createResearchGroup(
          this.group.name,
          this.group.permlink,
          this.group.description,
          parseInt(maxProposalPercent) * this.DEIP_1_PERCENT,
          proposalQuorums,
          invitees
        ).then((response) => {
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
          console.log(err)
        });
      }
    },
    created() {
      if (this.$route.query['back-token']) {
        try {
          this.backRouterToken = JSON.parse(this.$route.query['back-token']);
        } catch (e) {
          console.error('Invalid back router token');
        }
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
