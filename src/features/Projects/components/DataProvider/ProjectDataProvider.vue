<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { projectDetailsStore } from '@/features/Projects/store/projectDetailsStore';

  export default {
    name: 'ProjectDataProvider',
    mixins: [componentStoreFactoryOnce(projectDetailsStore, 'Project')],
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
