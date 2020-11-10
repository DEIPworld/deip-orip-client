<template>
  <fundraising
    :security-token="research.securityTokens[0]"
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
    name: 'ProjectFundraising',
    components: { Fundraising },
    computed: {
      ...mapGetters({
        research: 'Project/data'
      })
    }
  };
</script>
