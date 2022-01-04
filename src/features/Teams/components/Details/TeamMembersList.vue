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
          {{ $t('teamDetails.invite') }}
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
      :title="$t('teamDetails.addMemberDialog.title')"
      :button-true-text="$t('teamDetails.addMemberDialog.create')"
      :loading="addMemberDialog.isLoading"
      :disabled="addMemberDialogIsDisabled || addMemberDialog.isLoading"
      @click:confirm="sendProposal()"
      @click:cancel="close()"
    >
      <user-selector
        v-model="addMemberDialog.selectedUser"
        :portal-id="$env.TENANT"
        class="mb-4"
        :label="$t('teamDetails.addMemberDialog.findPlaceholder')"
        :multiple="false"
      />

      <v-textarea
        v-model="addMemberDialog.coverLetter"
        :label="$t('teamDetails.addMemberDialog.letterLabel')"
        auto-grow
        outlined
        rows="6"
      />
    </vex-dialog>
  </div>
</template>

<script>
  import { TeamService } from '@deip/team-service';
  import { mapGetters } from 'vuex';
  import UsersList from '@/components/MemberList/UsersList';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  const teamService = TeamService.getInstance();

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
        return this.$store.getters['auth/userIsTeamMemberExId'](this.team._id);
      },
      isGroupMembersActionsColumnAvailable() {
        return this.team._id !== this.$currentUser.username
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
        teamService.removeTeamMember(
          {
            initiator: {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            teamId: this.team._id,
            member: member.username
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('memberList.dropPropSucc'));
            this.$store.dispatch('TransactionsList/loadTransactions', this.team._id);
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
        teamService.addTeamMember(
          {
            initiator: {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            teamId: this.team._id,
            member: this.addMemberDialog.selectedUser,
            notes: this.addMemberDialog.coverLetter
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('teamDetails.addMemberDialog.success'));
            this.$store.dispatch('TransactionsList/loadTransactions', this.team._id);
          }).catch((err) => {
            this.$notifier.showError(this.$t('teamDetails.addMemberDialog.err'));
            console.error(err);
          }).finally(() => {
            this.addMemberDialog.isLoading = false;
            this.addMemberDialog.isOpen = false;
          });
      }
    }
  }
</script>
