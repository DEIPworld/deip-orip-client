<template>
  <fundraising
    :security-token-id="research.securityTokens[0][0]"
    :research-id="research.externalId"
    :research-title="research.title"
    :research-group-id="research.researchGroup.external_id"
    :research-group-name="research.researchGroup.name"
  />
</template>

<script>
  import Fundraising from '@/components/Fundraising/FundraisingPage/Fundraising';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchFundraising',
    components: { Fundraising },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      })
    }
  };
</script>
