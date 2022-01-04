<template>
  <fundraising
    :project="project"
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
        project: 'Project/projectDetails'
      })
    }
  };
</script>
