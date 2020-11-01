<template>
  <v-card
    class="d-flex flex-column"
    outlined
    :to="{
      name: 'research.details',
      params: {
        researchExternalId: project.externalId
      }
    }"
  >

    <slot name="itemCardActions" :project="project$" />

    <project-list-item-renderer
      class="d-flex flex-column flex-shrink-1 flex-grow-1"
      :schema="layoutSchema"
      :project="project$"
    />
  </v-card>
</template>

<script>
  import ProjectListItemRenderer from '@/components/Projects/List/renderer';
  import { projectItem } from '@/components/Projects/List/mixins';

  export default {
    name: 'ProjectsListGridCard',
    components: {
      ProjectListItemRenderer
    },
    mixins: [projectItem],
    props: {
      layoutKey: {
        type: String,
        default: 'projectListCard'
      }
    }
  };
</script>
