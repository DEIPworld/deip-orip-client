<template>
  <fundraising
    :research="research"
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
        research: 'Project/projectDetails'
      })
    }
  };
</script>
