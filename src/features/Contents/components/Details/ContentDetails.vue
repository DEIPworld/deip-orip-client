<template>
  <research-content-details
    :perm-data="permData"
  />
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ContentDetails',

    computed: {
      ...mapGetters({
        content: 'Content/contentDetails',
        project: 'Project/projectDetails'
      }),

      permData() {
        return {
          projectId: this.project.externalId,
          contentId: this.content.externalId
        };
      }
    }
  };
</script>
