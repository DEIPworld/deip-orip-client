import { mapGetters } from 'vuex';
import { ResearchService } from '@deip/research-service';
import { AssetsService } from '@deip/assets-service';
import { assetsChore } from '@/mixins/chores';

const researchService = ResearchService.getInstance();
const assetsService = AssetsService.getInstance();

export const CreateTokenSaleMixin = {
  mixins: [assetsChore],
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
        assetsList: []
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
        const { assetId } = this.$$fromAssetUnits(this.research.security_tokens[0]);
        return assetsService.getAssetBySymbol(assetId);
      })
      .then((securityToken) => {
        this.securityTokenOnSale = securityToken;
        return assetsService.getAccountAssetBalance(
          this.research.research_group.external_id, this.securityTokenOnSale.string_symbol
        );
      })
      .then((balance) => {
        this.securityTokenOnSaleBalance = balance || null;
        return assetsService.getAssetsByType(1);
      })
      .then((assetsList) => { this.formData.assetsList = assetsList; this.$setReady(); });
  }
};
