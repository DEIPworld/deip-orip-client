<template>
  <fundraising
    :research-id="research.id"
    :research-title="research.title"
  />
</template>

<script>
  import Fundraising from '@/components/Fundraising/FundraisingPage/Fundraising';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchFoundraising',
    components: { Fundraising },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      })
    }
  };
</script>
