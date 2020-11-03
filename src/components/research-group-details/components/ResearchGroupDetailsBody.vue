<template>
  <div>
    <v-row justify="space-between">
      <v-col cols="12" md="6">
        <div class="text-h5 mb-4">
          {{ group ? group.name : '' }}
          <v-btn
            v-if="isResearchGroupMember && !isPersonalGroup"
            icon
            small
            :to="{
              name: 'ResearchGroupSettings',
              params: {
                research_group_permlink: encodeURIComponent(group.permlink)
              }
            }"
          >
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </div>
        <div class="text-body-2">
          {{ group ? group.description : '' }}
        </div>
        <v-btn
          v-if="isJoinBtnAvailable"
          class="mt-4"
          color="primary"
          outlined
        >
          {{ $t('researchGroupDetails.join') }}
        </v-btn>
      </v-col>
      <v-col v-if="(isJoinRequestsSectionAvailable || invites.length) && isResearchGroupMember" cols="auto">
        <research-group-requests />
      </v-col>
    </v-row>

    <v-divider class="my-12" />

    <!-- ### START Research Group Proposals Section ### -->
    <div v-if="isResearchGroupMember && group.is_dao" id="proposals" class="my-12">
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

    <member-list namespace="memberDetails" :group="group" class="mb-12">
      <template #title-append-after>
        <v-btn
          v-if="isResearchGroupMember && !group.is_personal"
          color="primary"
          class="mt-4"
          outlined
          small
          @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })"
        >
          {{ $t('researchGroupDetails.invite') }}
        </v-btn>
      </template>
    </member-list>

    <!-- ### START Research Group Research List Section ### -->

    <projects-list
      :team-id="group.external_id"
    >
      <template #title-append-after>
        <v-btn
          v-if="isResearchGroupMember && !group.is_personal"
          color="primary"
          small
          :to="tenant.profile.settings.newResearchPolicy === 'free' ? { name: 'research.create' } : { name: 'CreateResearchProposal' }"
          outlined
        >
          {{ $t('researchGroupDetails.start') }}
        </v-btn>
      </template>
    </projects-list>

    <add-member-to-group-dialog
      v-if="group"
      :group-external-id="group.external_id"
      :users="usersToInvite"
      @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
      @onSuccess="$store.dispatch('researchGroup/loadResearchGroupProposals', { account: group.external_id })"
    />
    <!-- ### END Research Group Research List Section ### -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  import { ResearchGroupService } from '@deip/research-group-service';
  import { UsersService } from '@deip/users-service';
  import MemberList from '@/components/MemberList/MemberList';
  import ResearchGroupRequests from '@/components/research-group-details/components/ResearchGroupRequests';
  import ProjectsList from '@/components/Projects/List/ProjectsList';

  const researchGroupService = ResearchGroupService.getInstance();
  const usersService = UsersService.getInstance();

  export default {
    name: 'ResearchGroupDetailsBody',
    components: {
      ProjectsList,
      MemberList,
      ResearchGroupRequests
    },
    props: {},
    data() {
      return {
        invitesTabs: null,
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
        members: 'researchGroup/members',
        invites: 'researchGroup/invites',
        isLoadingResearchGroupDetails: 'researchGroup/isLoadingResearchGroupDetails',
        isLoadingResearchGroupMembers: 'researchGroup/isLoadingResearchGroupMembers',
        isLoadingResearchGroupProposals: 'researchGroup/isLoadingResearchGroupProposals',
        userPersonalGroup: 'auth/userPersonalGroup',
        pendingJoinRequests: 'researchGroup/pendingJoinRequests',
        tenant: 'auth/tenant'
      }),
      isJoinBtnAvailable() {
        return false;
      },
      isPersonalGroup() {
        return this.group.id == this.userPersonalGroup.id;
      },
      isResearchGroupMember() {
        return this.$store.getters['auth/userIsResearchGroupMember'](this.group.id);
      },
      isGroupMembersActionsColumnAvailable() {
        return !this.isPersonalGroup && this.isResearchGroupMember && (this.group.is_dao || (!this.group.is_dao && this.user.username == this.group.creator));
      },
      isJoinRequestsSectionAvailable() {
        const hasPendingJoinRequests = this.pendingJoinRequests && this.pendingJoinRequests.length;

        const isResearchGroupMember = this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false;

        return hasPendingJoinRequests && isResearchGroupMember;
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
      deipRpc.api.lookupAccountsAsync('0', 10000)
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
        researchGroupService.leaveResearchGroupViaOffchain(
          {
            privKey: this.user.privKey,
            username: this.user.username
          },
          {
            member: member.item.owner,
            researchGroup: this.group.external_id,
            isExclusion: true,
            extensions: []
          },
          {
            notes: ""
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('researchGroupDetails.successDrop'));
            this.$store.dispatch('researchGroup/loadResearchGroupProposals', { account: this.group.external_id });
          })
          .catch((err) => {
            this.$notifier.showError(this.$t('researchGroupDetails.errDrop'));
            console.error(err);
          })
          .finally(() => {
            this.dropoutMemberMeta.isConfirming = false;
            this.dropoutMemberMeta.isShown = false;
            this.$vuetify.goTo('#proposals');
          });
      },

      showConfirmAction(member) {
        const memberData = {
          firstName: member.profile.firstName,
          lastName: member.profile.lastName,
          owner: member.rgt.owner
        };
        this.dropoutMemberMeta.item = memberData;
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
