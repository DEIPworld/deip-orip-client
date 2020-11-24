<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { projectDetailsStore } from '@/features/Projects/store/projectDetailsStore';

  export default {
    name: 'Project',
    mixins: [componentStoreFactoryOnce(projectDetailsStore)],
    props: {
      projectId: {
        type: String,
        required: true
      }
    },
    created() {
      this.$store
        .dispatch('Project/getProjectDetails', this.projectId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
