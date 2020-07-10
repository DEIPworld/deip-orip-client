import {
  mapGetters
} from 'vuex';

export const CreateResearchGroupMixin = {
  data() {
    return {
      formProcessing: false,
      backRouterToken: undefined,
      isPermlinkVerifyed: true,

      formData: {
        name: '',
        permlink: '',
        description: '',
        members: [],

        quorum: {
          startResearch: 0,
          inviteMembers: 0,
          dropoutMembers: 0,
          sendFunds: 0,
          startResearchTokenSale: 0,
          rebalanceGroupTokens: 0,
          changeQuorum: 0,
          changeReviewSharePercent: 0,
          offerResearchTokens: 0,
          createMaterial: 0,
          researchGroupMeta: 0,
          researchMeta: 0
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  created() {
    if (this.$route.query['back-token']) {
      try {
        this.backRouterToken = JSON.parse(this.$route.query['back-token']);
      } catch (e) {
        console.error('Invalid back router token');
      }
    }
  },
}
