<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/features/Projects/store/projectDetailsStore';

  export default {
    name: 'Project',
    mixins: [componentStoreFactoryOnce(researchStore)],
    created() {
      this.$store
        .dispatch('Project/getResearchDetails', this.$route.params.researchExternalId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
