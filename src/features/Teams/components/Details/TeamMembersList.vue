<template>
  <div>
    <users-list namespace="memberDetails" :group="team" class="mb-12">
      <!-- DISABLED FOR NOW DUE TO NEW PROJECT TEAM MODEL -->
      <!-- <template #title-append-after>
        <v-btn
          v-if="isTeamMember"
          color="primary"
          class="mt-4"
          outlined
          small
          @click="addMemberDialog.isOpen = true"
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
      </template> -->
    </users-list>
    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      :loading="actionDialog.loading"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
    <vex-dialog
      v-model="addMemberDialog.isOpen"
      :title="$t('researchGroupDetails.addMemberDialog.title')"
      :button-true-text="$t('researchGroupDetails.addMemberDialog.create')"
      :loading="addMemberDialog.isLoading"
      :disabled="addMemberDialogIsDisabled || addMemberDialog.isLoading"
      @click:confirm="sendProposal()"
      @click:cancel="close()"
    >
      <user-selector
        v-model="addMemberDialog.selectedUser"
        :tenant-id="$env.TENANT"
        class="mb-4"
        :label="$t('researchGroupDetails.addMemberDialog.findPlaceholder')"
        :multiple="false"
      />

      <v-textarea
        v-model="addMemberDialog.coverLetter"
        :label="$t('researchGroupDetails.addMemberDialog.letterLabel')"
        auto-grow
        outlined
        rows="6"
      />
    </vex-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import UsersList from '@/components/MemberList/UsersList';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  export default {
    name: 'TeamMembersList',
    components: {
      UsersList,
      UserSelector
    },
    data() {
      return {
        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          actionLabel: null,
          loading: false,
          action: () => false
        },
        addMemberDialog: {
          isOpen: false,
          selectedUser: undefined,
          coverLetter: '',
          isLoading: false
        }
      };
    },
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      }),
      isTeamMember() {
        return this.$store.getters['auth/userIsResearchGroupMemberExId'](this.team.externalId);
      },
      isGroupMembersActionsColumnAvailable() {
        return this.team.externalId !== this.$currentUser.username
          && this.isTeamMember
          && (
            this.team.isDao || (!this.team.isDao && this.$currentUser.username == this.team.creator)
          );
      },
      addMemberDialogIsDisabled() {
        return !this.addMemberDialog.selectedUser;
      }
    },
    methods: {
      isExcludingMemberAvailable(username) {
        return this.isGroupMembersActionsColumnAvailable && this.$currentUser.username !== username;
      },
      dropoutMember(member) {
        this.actionDialog.loading = true;
        this.actionDialog.loading = false;
        this.actionDialog.isOpen = false;
        // researchGroupService.leaveResearchGroup(
        //   {
        //     privKey: this.$currentUser.privKey,
        //     username: this.$currentUser.username
        //   },
        //   {
        //     member: member.username,
        //     researchGroup: this.team.externalId,
        //     isExclusion: true,
        //     extensions: []
        //   },
        //   {
        //     notes: ''
        //   }
        // )
        //   .then(() => {
        //     this.$notifier.showSuccess(this.$t('memberList.dropPropSucc'));
        //     this.$store.dispatch('TransactionsList/loadTransactions', this.team.externalId);
        //   })
        //   .catch((err) => {
        //     this.$notifier.showError(this.$t('memberList.dropPropFail'));
        //     console.error(err);
        //   })
        //   .finally(() => {
        //     this.actionDialog.loading = false;
        //     this.actionDialog.isOpen = false;
        //     this.$vuetify.goTo('#proposals');
        //   });
      },
      showConfirmAction(user) {
        this.actionDialog = {
          isOpen: true,
          title: this.$t('memberList.excDialog.title'),
          description: this.$t('memberList.excDialog.text', { fullname: this.$options.filters.fullname(user), team: this.team.name }),
          actionLabel: this.$t('memberList.excDialog.confirm'),
          loading: false,
          action: () => this.dropoutMember(user)
        };
      },
      sendProposal() {
        this.addMemberDialog.isLoading = true;
        this.addMemberDialog.isOpen = false;
        this.addMemberDialog.isLoading = false;
        // researchGroupService.createResearchGroupInvite(
        //   { privKey: this.$currentUser.privKey, username: this.$currentUser.username },
        //   {
        //     researchGroup: this.team.externalId,
        //     member: this.addMemberDialog.selectedUser,
        //     rewardShare: '0.00 %',
        //     researches: [],
        //     extensions: []
        //   },
        //   {
        //     notes: this.addMemberDialog.coverLetter
        //   }
        // )
        //   .then(() => {
        //     this.$notifier.showSuccess(this.$t('researchGroupDetails.addMemberDialog.success'));
        //     this.$store.dispatch('TransactionsList/loadTransactions', this.team.externalId);
        //   }).catch((err) => {
        //     this.$notifier.showError(this.$t('researchGroupDetails.addMemberDialog.err'));
        //     console.error(err);
        //   }).finally(() => {
        //     this.addMemberDialog.isLoading = false;
        //     this.addMemberDialog.isOpen = false;
        //   });
      }
    }
  }
</script>
