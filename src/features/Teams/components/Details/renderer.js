import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';

import ProjectsList from '@/features/Projects/components/List/ProjectsList';
import TeamDetailsEditCta from '@/features/Teams/components/Details/TeamDetailsEditCta';
import TeamAsset from '@/features/Teams/components/Details/TeamAsset';
import TeamRequests from '@/features/Teams/components/Details/TeamRequests';
import TeamTransactionsList from '@/features/Teams/components/Details/TeamTransactionsList';
import TeamMembersList from '@/features/Teams/components/Details/TeamMembersList';

export default {
  name: 'TeamDetailsRenderer',
  components: {
    AttributesRead,
    TeamDetailsEditCta,
    TeamAsset,
    ProjectsList,
    TeamRequests,
    TeamTransactionsList,
    TeamMembersList
  },
  mixins: [
    componentsRenderer
  ],
  props: {
    team: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    isTeamMember() {
      return this.$store.getters['auth/userIsTeamMemberExId'](this.team._id);
    },
    isPersonalTeam() {
      return this.team._id === this.$currentUser.username;
    }
  }
};
