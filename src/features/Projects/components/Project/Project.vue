<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/features/Projects/store/projectDetailsStore';

  export default {
    name: 'Project',
    mixins: [componentStoreFactoryOnce(researchStore)],
    props: {
      projectId: {
        type: String,
        required: true
      }
    },
    created() {
      this.$store
        .dispatch('Project/getResearchDetails', this.projectId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
