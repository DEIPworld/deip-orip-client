<template>
  <vex-dialog
    v-model="isOpen"
    :title="$t('researchGroupDetails.addMemberDialog.title')"
    :button-true-text="$t('researchGroupDetails.addMemberDialog.create')"
    :loading="isLoading"
    :disabled="isDisabled || isLoading"
    @click:confirm="sendProposal()"
    @click:cancel="close()"
  >
    <user-selector
      v-model="selectedUser"
      class="mb-4"
      :label="$t('researchGroupDetails.addMemberDialog.findPlaceholder')"
      :multiple="false"
    />

    <v-textarea
      v-model="coverLetter"
      :label="$t('researchGroupDetails.addMemberDialog.letterLabel')"
      auto-grow
      outlined
      rows="6"
    />
  </vex-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ResearchGroupService } from '@deip/research-group-service';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'AddMemberToGroupDialog',

    props: {
      groupExternalId: { required: true, type: String },
      users: { required: true, type: Array, default: () => [] }
    },
    components: {
      UserSelector
    },
    data() {
      return {
        selectedUser: undefined,
        coverLetter: '',
        isLoading: false
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        options: 'researchGroup/options'
      }),
      isOpen: {
        get() {
          return this.options.isAddMemberDialogOpen;
        },
        set() {
          this.close();
        }
      },
      isDisabled() {
        return !this.selectedUser;
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        this.selectedUser = undefined;
        this.coverLetter = '';
      }
    },
    methods: {
      close() {
        this.$emit('onClose');
      },

      sendProposal() {
        this.isLoading = true;
        researchGroupService.createResearchGroupInvite(
          { privKey: this.user.privKey, username: this.user.username },
          {
            researchGroup: this.groupExternalId,
            member: this.selectedUser,
            rewardShare: '0.00 %',
            researches: [],
            extensions: []
          }, 
          {
            notes: this.coverLetter,
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('researchGroupDetails.addMemberDialog.success'));
            this.$emit('onSuccess');
          }).catch((err) => {
            this.$notifier.showError(this.$t('researchGroupDetails.addMemberDialog.err'));
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
