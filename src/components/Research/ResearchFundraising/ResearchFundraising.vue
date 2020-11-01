<template>
  <fundraising
    :research-id="research.id"
    :research-title="research.title"
    :group-name="research.researchGroup.name"
    :group-owned-tokens="research.ownedTokens"
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
