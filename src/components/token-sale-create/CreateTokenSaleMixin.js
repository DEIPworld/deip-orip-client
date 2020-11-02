import { mapGetters } from 'vuex';
import { ResearchService } from '@deip/research-service';
import { InvestmentsService } from '@deip/investments-service';

const researchService = ResearchService.getInstance();
const investmentsService = InvestmentsService.getInstance();

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
        asset: undefined,
      },
      securityTokenOnSale: null,
      securityTokenOnSaleBalance: null,

      formValid: false,
      formProcessing: false
    };
  },

  created() {
    researchService.getResearch(this.$route.params.researchExternalId)
      .then((research) => {
        this.group_permlink = research.research_group.permlink;
        this.research = research;
        return investmentsService.getSecurityToken(this.research.security_tokens[0][0]);
      })
      .then((securityToken) => {
        this.securityTokenOnSale = securityToken;
        return investmentsService.getSecurityTokenBalance(this.research.research_group.external_id, this.securityTokenOnSale.external_id);
      })
      .then((balance) => {
        this.securityTokenOnSaleBalance = balance || null;
      })
  }
};
