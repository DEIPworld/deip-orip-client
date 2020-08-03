<template>

</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'EciMetricsWidget',
    props: {
      contentId: {
        type: String,
        default: undefined
      },

      researchId: {
        type: String,
        default: undefined
      },

      accountName: {
        type: String,
        default: undefined
      }
    },
    computed: {
      ...mapGetters({
        expertiseHistory: 'eci/expertiseHistory',
        expertiseStats: 'eci/expertiseStats'
      })
    }
  };
</script>
