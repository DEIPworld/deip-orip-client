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
          groupPermalink: this.project.researchGroup.permlink,
          projectPermalink: this.project.permlink,
          contentPermalink: this.content.permlink
        };
      }
    }
  };
</script>
