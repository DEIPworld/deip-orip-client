import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';

import EciStats from '@/components/EciMetrics/EciStats/EciStats';

import UserDetailsEditCta from '@/features/Users/components/User/Details/UserDetailsEditCta';
import UserDetailsEducation from '@/features/Users/components/User/Details/UserDetailsEducation';
import UserDetailsEmployment from '@/features/Users/components/User/Details/UserDetailsEmployment';

import { userDetails } from '@/features/Users/mixins/userDetails';
import ProjectsList from '@/features/Projects/components/List/ProjectsList';
import TeamsList from '@/features/Teams/components/List/TeamsList';

export default {
  name: 'UserDetailsRenderer',
  components: {
    UserDetailsEditCta,
    ProjectsList,
    TeamsList,

    EciStats,
    AttributesRead,
    UserDetailsEducation,
    UserDetailsEmployment
  },
  mixins: [
    componentsRenderer,
    userDetails
  ],
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    isAccountPage() {
      return this.$route.name.includes('account.summary');
    }
  }
};
