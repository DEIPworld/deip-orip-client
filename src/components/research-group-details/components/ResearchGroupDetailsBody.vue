<template>
  <div>
    <v-row>
      <v-col cols="auto">
        <div class="title">
          {{ group ? group.name : '' }}
        </div>
      </v-col>
      <v-col>
        <v-btn
          v-if="isResearchGroupMember && !isPersonalGroup"
          class="ma-0 align-self-center"
          small
          outlined
          color="primary"
          :to="{
            name: 'ResearchGroupSettings',
            params: {
              research_group_permlink: encodeURIComponent(group.permlink)
            }
          }"
        >
          Edit team
        </v-btn>
      </v-col>
    </v-row>
    <div class="body-1 pt-6">
      {{ group ? group.description : '' }}
    </div>

    <!-- ### START Research Group Proposals Section ### -->
    <div v-if="isResearchGroupMember && group.is_dao" class="mt-12">
      <transition v-if="highlightProposalsSection" name="fade">
        <div v-if="proposalsSectionTransitionTrigger" class="pt-2 pb-6">
          <research-group-details-proposals :key="'group-proposals'" />
        </div>
      </transition>
      <div v-else>
        <div class="pt-2 pb-6">
          <research-group-details-proposals :key="'group-proposals'" />
        </div>
      </div>
    </div>
    <!-- ### END Research Group Proposals Section ### -->

    <!-- ### START Research Group members Section ### -->
    <div class="mt-12">
      <div class="title">
        Team members: {{ members.length }}
      </div>
      <div class="pt-6">
        <v-card>
          <div class="info-card-list">
            <v-row class="list-line align-center">
              <v-col class="list-header-cell" :class="isGroupMembersActionsColumnAvailable ? 'xs3': 'xs4'">
                Researcher
              </v-col>
              <!-- <v-col class="list-header-cell" cols="4">
                Expertise
              </v-col> -->
              <v-col class="list-header-cell text-align-center" cols="2">
                Member since
              </v-col>
              <v-col class="list-header-cell text-align-center" cols="2">
                Location
              </v-col>
              <v-col v-if="isGroupMembersActionsColumnAvailable" class="list-header-cell text-align-center" cols="1">
                Action
              </v-col>
            </v-row>

            <v-divider />

            <template v-for="(member, i) in members">
              <v-row :key="'member-' + i" class="list-line">
                <v-col class="list-body-cell display-flex" :class="isGroupMembersActionsColumnAvailable ? 'xs3' : 'xs4'">
                  <platform-avatar
                    :user="member"
                    :size="40"
                  />
                  <div class="pl-4">
                    <router-link
                      :to="{ name: 'UserDetails', params: { account_name: member.account.name } }"
                      class="a subtitle-1"
                    >
                      {{ member | fullname }}
                    </router-link>

                    <div class="caption c-pt-1">
                      {{ member | employmentOrEducation }}
                    </div>
                  </div>
                </v-col>

                <!-- <v-col class="list-body-cell" cols="3">
                  <div v-for="(item, i) in member.expertise" :key="i">
                    <span class="uppercase bold">{{ item.discipline_name }}:</span> {{ item.amount }}
                  </div>
                </v-col> -->

                <v-col class="text-align-center list-body-cell" cols="2">
                  {{ member.created | dateFormat('D MMM YYYY') }}
                </v-col>

                <v-col class="text-align-center list-body-cell" cols="2">
                  {{ member | userLocation }}
                </v-col>

                <v-col v-if="isGroupMembersActionsColumnAvailable" class="text-align-center list-body-cell" cols="1">
                  <div v-if="isExcludingMemberAvailable(member.rgt.owner)">
                    <v-btn
                      text
                      icon
                      color="grey"
                      class="ma-0"
                      @click="showConfirmAction(member, i)"
                    >
                      <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>

              <v-divider :key="'member-divider-' + i" />
            </template>
          </div>

          <confirm-action-dialog
            :meta="dropoutMemberMeta"
            :title="`You’re about to exclude`"
            :text="`${dropoutMemberMeta.item ? `${dropoutMemberMeta.item.firstName} ${dropoutMemberMeta.item.lastName}` : ''} from ${group.name} Research Group`"
            @confirmed="dropoutMember($event);"
            @canceled="dropoutMemberMeta.isShown = false"
          />

          <div v-if="isResearchGroupMember && !group.is_personal" class="px-6 py-4">
            <v-btn
              outlined
              icon
              color="primary"
              class="ma-0"
              @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })"
            >
              <v-icon small>
                add
              </v-icon>
            </v-btn>

            <span class="pl-2">Invite team members</span>
          </div>

          <div v-if="isResearchGroupMember && invites.length">
            <v-divider />

            <v-expansion-panels class="group-invites">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <!-- <v-icon small color="primary">access_time</v-icon> -->
                  <span class="">Pending invites ({{ invites.length }})</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="">
                    <template v-for="(invite, i) in invites">
                      <v-divider :key="'invite-divider-' + i" />

                      <v-row
                        :key="'invite-' + i"
                        class="py-4 px-6"
                        align="center"
                      >
                        <v-col class="display-flex" cols="4">
                          <platform-avatar
                            :user="invite.user"
                            :size="40"
                          />

                          <div class="grow pl-4">
                            <router-link
                              :to="{
                                name: 'UserDetails',
                                params: { account_name: invite.user.account.name }
                              }"
                              class="a subtitle-1"
                            >
                              {{ invite.user | fullname }}
                            </router-link>

                            <div class="caption pt-1">
                              {{ invite.user | employmentOrEducation }}
                            </div>
                          </div>
                        </v-col>

                        <v-col class="grow text-right">
                          {{ invite.user | userLocation }}
                        </v-col>

                      </v-row>
                    </template>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card>

        <add-member-to-group-dialog
          v-if="group"
          :isOpen="options.isAddMemberDialogOpen"
          :groupExternalId="group.external_id"
          :users="usersToInvite"
          @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
          @onSuccess="$store.dispatch('researchGroup/loadResearchGroupProposals', { account: group.external_id })"
        />
      </div>
    </div>
    <!-- ### END Research Group members Section ### -->

    <!-- ### START Research Group Research List Section ### -->
    <state-research-list class="mt-12" :research-list="researchWithGroupInfoList" />
    <!-- ### END Research Group Research List Section ### -->
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  import { ResearchGroupService } from '@deip/research-group-service';
  import { UsersService } from '@deip/users-service';

  const researchGroupService = ResearchGroupService.getInstance();
  const usersService = UsersService.getInstance();

  export default {
    name: 'ResearchGroupDetailsBody',

    props: {},
    data() {
      return {
        highlightProposalsSection: undefined,
        proposalsSectionTransitionTrigger: false,
        usersToInvite: [],

        dropoutMemberMeta: {
          isShown: false,
          item: null,
          index: null,
          isConfirming: false
        },
        isLoadingDropoutBtn: false,
        isDisabledDropoutBtn: false
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        group: 'researchGroup/group',
        researchList: 'researchGroup/researchList',
        options: 'researchGroup/options',
        members: 'researchGroup/members',
        invites: 'researchGroup/invites',
        isLoadingResearchGroupDetails: 'researchGroup/isLoadingResearchGroupDetails',
        isLoadingResearchGroupMembers: 'researchGroup/isLoadingResearchGroupMembers',
        isLoadingResearchGroupProposals: 'researchGroup/isLoadingResearchGroupProposals',
        userPersonalGroup: 'auth/userPersonalGroup'
      }),
      isPersonalGroup() {
        return this.group.id == this.userPersonalGroup.id;
      },
      isResearchGroupMember() {
        return this.$store.getters['auth/userIsResearchGroupMember'](this.group.id);
      },
      isGroupMembersActionsColumnAvailable() {
        return !this.isPersonalGroup && this.isResearchGroupMember && (this.group.is_dao || (!this.group.is_dao && this.user.username == this.group.creator));
      },
      researchWithGroupInfoList() {
        return this.researchList.map((research) => ({
          research,
          group: this.group
        }));
      }
    },

    mounted() {
      if (this.highlightProposalsSection) {
        this.proposalsSectionTransitionTrigger = true;
      }
    },

    created() {
      this.highlightProposalsSection = this.$route.hash === '#proposals';
      // TODO: request server for tenant users
      deipRpc.api.getAllAccountsAsync()
        .then((accounts) => {
          const blackList = [
            'regacc', 'hermes', 'initdelegate',
            ...this.members.map((member) => member.account.name),
            ...this.invites.map((invite) => invite.user.account.name)
          ];
          const usersToInvite = accounts
            .filter((a) => !a.is_research_group && !blackList.some((username) => username === a.name))
            .map((a) => a.name);
          return usersService.getEnrichedProfiles(usersToInvite);
        })
        .then((users) => {
          this.usersToInvite = users;
        });
    },

    methods: {
      dropoutMember(member) {
        this.dropoutMemberMeta.isConfirming = true;
        researchGroupService.leftResearchGroupViaOffchain(this.user.privKey, {
          member: member.item.owner,
          researchGroup: this.group.external_id,
          isExclusion: true,
          extensions: []
        }, {
          notes: "",
          approver: null
        })
          .then(() => {
            this.$store.dispatch('layout/setSuccess', {
              message: 'Dropout Proposal has been created successfully!'
            });
            this.$store.dispatch('researchGroup/loadResearchGroupProposals', { account: this.group.external_id });
          })
          .catch((err) => {
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating proposal, please try again later'
            });
            console.log(err);
          })
          .finally(() => {
            this.dropoutMemberMeta.isConfirming = false;
            this.dropoutMemberMeta.isShown = false;
            this.$vuetify.goTo('#proposals');
          });
      },

      showConfirmAction(member, index) {
        const memberData = {
          firstName: member.profile.firstName,
          lastName: member.profile.lastName,
          owner: member.rgt.owner
        };
        this.dropoutMemberMeta.item = memberData;
        this.dropoutMemberMeta.index = index;
        this.dropoutMemberMeta.isShown = true;
      },

      isExcludingMemberAvailable(username) {
        return this.isGroupMembersActionsColumnAvailable && this.user.username != username;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "./../../../styles/colors.less";

  .group-invites.expansion-panel {
    box-shadow: initial;
  }

  .research-group-details-container {
    min-height: 200px
  }

  .fade-enter-active, .fade-leave-active {
    background-color: none !important;
    transition: all 2.5s !important;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    background-color: @yellow !important;
  }

  .info-card-list {
    .list-line {
      display: flex;
      padding-top: 24px;
      padding-bottom: 24px;
      padding-left: 12px;
      padding-right: 12px;
    }

    .list-header-cell {
      padding-right: 12px;
      padding-left: 12px;
      color: @grey;
    }

    .list-body-cell {
      padding-right: 12px;
      padding-left: 12px;
      align-self: center;
    }
  }
</style>
