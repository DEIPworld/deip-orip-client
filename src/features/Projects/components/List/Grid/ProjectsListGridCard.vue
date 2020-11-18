<template>
  <v-card
    class="d-flex flex-column"
    outlined
    :to="{
      name: 'project.details',
      params: {
        researchExternalId: project.externalId
      }
    }"
  >
    <slot name="itemCardActions" :project="$$projectExtended" />

    <project-list-item-renderer
      class="d-flex flex-column flex-shrink-1 flex-grow-1"
      :schema="layoutSchema"
      :project="$$projectExtended"
    />
  </v-card>
</template>

<script>
  import { projectListItem } from '@/features/Projects/mixins';

  export default {
    name: 'ProjectsListGridCard',
    mixins: [projectListItem],
    props: {
      layoutKey: {
        type: String,
        default: 'projectListCard'
      }
    }
  };
</script>
