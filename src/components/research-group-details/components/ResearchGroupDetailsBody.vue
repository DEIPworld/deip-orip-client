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
              name: 'teamSettings',
              params: {
                teamId: group.external_id
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

    <research-group-asset v-if="$hasModule(DEIP_MODULE.APP_PAGE_ASSETS)" class="mb-12" />

    <!-- ### START Research Group Proposals Section ### -->
    <d-block
      v-if="$hasModule(DEIP_MODULE.APP_PAGE_MULTISIG_TRANSACTIONS) && isResearchGroupMember && !group.is_personal"
      id="proposals"
      class="mb-12"
      :title="$t('researchGroupDetails.proposalsTable.title')"
    >
      <transition v-if="highlightProposalsSection" name="fade">
        <div v-if="proposalsSectionTransitionTrigger" class="pt-2 pb-6">
          <transactions-list :key="'group-proposals'" :account="group.external_id" />
        </div>
      </transition>
      <div v-else>
        <div class="pt-2 pb-6">
          <transactions-list :key="'group-proposals'" :account="group.external_id" />
        </div>
      </div>
    </d-block>
    <!-- ### END Project Group Proposals Section ### -->

    <users-list namespace="memberDetails" :group="group" class="mb-12">
      <template #title-append-after>
        <v-btn
          v-if="isResearchGroupMember"
          color="primary"
          class="mt-4"
          outlined
          small
          @click="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: true })"
        >
          {{ $t('researchGroupDetails.invite') }}
        </v-btn>
      </template>
      <template #itemRowActions="{ user }">
        <v-btn
          v-if="isExcludingMemberAvailable(user.username)"
          icon
          small
          @click.stop="showConfirmAction(user)"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template #itemCardActions="{ user }">
        <v-btn
          v-if="isExcludingMemberAvailable(user.username)"
          icon
          small
          absolute
          right
          top
          @click.stop="showConfirmAction(user)"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </users-list>

    <!-- ### START Project Group Project List Section ### -->

    <projects-list
      :team-id="group.external_id"
    />

    <add-member-to-group-dialog
      v-if="group"
      :group-external-id="group.external_id"
      :users="usersToInvite"
      @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isAddMemberDialogOpen', value: false })"
      @onSuccess="$store.dispatch('TransactionsList/loadTransactions', group.external_id)"
    />
    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      :loading="actionDialog.loading"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
    <!-- ### END Project Group Project List Section ### -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { UsersService } from '@deip/users-service';
  import UsersList from '@/components/MemberList/UsersList';
  import ResearchGroupRequests from '@/components/research-group-details/components/ResearchGroupRequests';
  import ResearchGroupAsset from '@/components/research-group-details/components/ResearchGroupAsset';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import TransactionsList from '@/components/TransactionsList/TransactionsList';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  const researchGroupService = ResearchGroupService.getInstance();
  const usersService = UsersService.getInstance();

  export default {
    name: 'ResearchGroupDetailsBody',
    components: {
      ProjectsList,
      UsersList,
      ResearchGroupRequests,
      ResearchGroupAsset,
      TransactionsList,
      DBlock
    },
    props: {},
    data() {
      return {
        invitesTabs: null,
        highlightProposalsSection: undefined,
        proposalsSectionTransitionTrigger: false,
        usersToInvite: [],

        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          actionLabel: null,
          loading: false,
          action: () => false
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
      usersService.getUsersListing()
        .then((users) => {
          this.usersToInvite = users.filter(u => 
            !this.invites.some((invite) => invite.user.account.name == u.account.name) &&
            !this.members.some((member) => member.account.name == u.account.name)
          );
        });
    },

    methods: {
      dropoutMember(member) {
        this.actionDialog.loading = true;
        researchGroupService.leaveResearchGroup(
          {
            privKey: this.user.privKey,
            username: this.user.username
          },
          {
            member: member.username,
            researchGroup: this.group.external_id,
            isExclusion: true,
            extensions: []
          },
          {
            notes: ''
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('memberList.dropPropSucc'));
            this.$store.dispatch('TransactionsList/loadTransactions', this.group.external_id);
            this.$emit('update');
          })
          .catch((err) => {
            this.$notifier.showError(this.$t('memberList.dropPropFail'));
            console.error(err);
          })
          .finally(() => {
            this.actionDialog.loading = false;
            this.actionDialog.isOpen = false;
            this.$vuetify.goTo('#proposals');
          });
      },

      showConfirmAction(user) {
        this.actionDialog = {
          isOpen: true,
          title: this.$t('memberList.excDialog.title'),
          description: this.$t('memberList.excDialog.text', { fullname: this.$options.filters.fullname(user), team: this.group.name }),
          actionLabel: this.$t('memberList.excDialog.confirm'),
          loading: false,
          action: () => this.dropoutMember(user)
        };
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
