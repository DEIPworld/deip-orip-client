import { mapGetters } from 'vuex';
import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

export const CreateTokenSaleMixin = {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  data() {
    return {
      research: {},
      group_permlink: '',
      formData: {
        amountToSell: null,
        startDate: null,
        endDate: null,
        softCap: '',
        hardCap: '',
        asset: undefined
      },

      formValid: false,
      formProcessing: false
    };
  },

  created() {
    researchService.getResearch(this.$route.params.researchExternalId)
      .then((research) => {
        this.group_permlink = research.research_group.permlink;
        this.research = research;
      });
  }
};
