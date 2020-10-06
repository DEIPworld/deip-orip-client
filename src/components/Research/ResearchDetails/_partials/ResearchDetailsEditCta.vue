<template>
  <v-btn
    v-if="project.members.includes(this.$currentUserName)"
    :to="{
      name: 'research.edit',
      params: {
        researchExternalId: project.externalId
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
  export default {
    name: 'ResearchDetailsEditCta',
    props: {
      project: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
