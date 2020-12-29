import { mapGetters } from 'vuex';
import { ResearchGroupService } from '@deip/research-group-service';

const researchGroupService = ResearchGroupService.getInstance();

export const dropoutMember = {
  data() {
    return {
      actionDialog: {
        isOpen: false,
        title: null,
        description: null,
        actionLabel: null,
        loading: false,
        action: () => false
      }
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
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
          member: member.rgt.owner,
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
    showConfirmAction(member) {
      this.actionDialog = {
        isOpen: true,
        title: this.$t('memberList.excDialog.title'),
        description: this.$t('memberList.excDialog.text', { firstName: member.profile.firstName, lastName: member.profile.lastName, team: this.group.name }),
        actionLabel: this.$t('memberList.excDialog.confirm'),
        loading: false,
        action: () => this.dropoutMember(member)
      };
    }
  }
};
