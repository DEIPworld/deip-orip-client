<template>
  <v-btn
    v-if="isMember"
    :to="{
      name: 'project.edit',
      params: {
        projectId: project._id
      }
    }"
    small
    outlined
  >
    <v-icon left size="18">
      mdi-circle-edit-outline
    </v-icon>
    Edit
  </v-btn>
</template>

<script>
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';

  export default {
    name: 'ProjectDetailsEditCta',
    mixins: [projectDetails]
  };
</script>
