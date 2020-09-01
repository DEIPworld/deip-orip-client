import DDialog from '@/components/Deipify/DDialog/DDialog';
import { mapGetters } from 'vuex';
import { ResearchGroupService } from '@deip/research-group-service';

const researchGroupService = ResearchGroupService.getInstance();

export const dropoutMember = {
  components: {
    DDialog
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
      researchGroupService.leftResearchGroupViaOffchain(this.user.privKey, {
        member: member.rgt.owner,
        researchGroup: this.group.external_id,
        isExclusion: true,
        extensions: []
      }, {
        notes: '',
        approver: null
      })
        .then(() => {
          this.$notifier.showSuccess('Dropout Proposal has been created successfully!');
          this.$store.dispatch('researchGroup/loadResearchGroupProposals', { account: this.group.external_id });
        })
        .catch((err) => {
          this.$notifier.showError('An error occurred while creating proposal, please try again later');
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
        title: 'You’re about to exclude',
        description: `${member.profile.firstName} ${member.profile.lastName} from ${this.group.name} Research Group`,
        actionLabel: 'Confirm',
        loading: false,
        action: () => this.dropoutMember(member)
      };
    }
  }
};
