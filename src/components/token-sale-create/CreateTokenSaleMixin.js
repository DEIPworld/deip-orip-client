import { mapGetters } from 'vuex';
import deipRpc from '@deip/rpc-client';

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
    deipRpc.api.getResearchByAbsolutePermlinkAsync(
      decodeURIComponent(this.$route.params.research_group_permlink),
      decodeURIComponent(this.$route.params.research_permlink)
    )
      .then((research) => {
        this.group_permlink = research.research_group.permlink;
        this.research = research;
      });
  }
};
