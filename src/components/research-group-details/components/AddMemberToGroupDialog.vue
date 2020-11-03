<template>
  <d-dialog
    v-model="isOpen"
    :title="$t('researchGroupDetails.addMemberDialog.title')"
    :confirm-button-title="$t('researchGroupDetails.addMemberDialog.create')"
    :loading="isLoading"
    :disabled="isDisabled || isLoading"
    @click:confirm="sendProposal()"
    @click:cancel="close()"
  >
    <v-autocomplete
      v-model="selectedUser"
      :items="users"
      outlined
      item-text="profile.firstName"
      item-value="account"
      :placeholder="$t('researchGroupDetails.addMemberDialog.findPlaceholder')"
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

    <v-textarea
      v-model="coverLetter"
      :label="$t('researchGroupDetails.addMemberDialog.letterLabel')"
      auto-grow
      outlined
      rows="6"
    />
  </d-dialog>
</template>

<script>
  import _ from 'lodash';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'AddMemberToGroupDialog',

    components: { DDialog },

    props: {
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

        researchGroupService.createResearchGroupInviteViaOffchain(
          { privKey: this.user.privKey, username: this.user.username },
          {
            researchGroup: this.groupExternalId,
            member: this.selectedUser.name,
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
