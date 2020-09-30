<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  export default {
    name: 'Research',
    mixins: [componentStoreFactoryOnce(researchStore)],
    created() {
      this.$store
        .dispatch('Research/getResearchDetails', this.$route.params.researchExternalId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
