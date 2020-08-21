import { PROPOSAL_TYPES } from '@/variables';

export const abstractResearchGroupDetailsProposalsItem = {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      PROPOSAL_TYPES
    };
  }
};
