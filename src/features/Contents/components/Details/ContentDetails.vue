<template>
  <research-content-details
    v-if="contentAssessAllowed"
    :perm-data="permData"
  />
</template>

<script>
  import { mapGetters } from 'vuex';
  import { projectDetails, projectContext } from '@/features/Projects/mixins/projectDetails';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'ContentDetails',

    mixins: [attributesChore],

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
      },
      // temp solution
      ...projectDetails.computed
    },
    created() {
      // temp solution
      if (!this.contentAssessAllowed) {
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: this.project.externalId
          }
        });
      }
    },
    // temp solution
    methods: {
      ...projectContext.methods
    }
  };
</script>
