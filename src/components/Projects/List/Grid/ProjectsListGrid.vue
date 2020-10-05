<template>
  <v-data-iterator
    :items="projects"
    v-bind="iteratorProps"
    @update:page="onUpdatePage"
  >
    <template #default="{ items }">
      <d-grid>
        <projects-list-grid-card
          v-for="item of items"
          :key="item.externalId"
          :project="item"
          :layout-key="cardLayoutKey"
        >
          <template #itemCardActions="{ project }">
            <slot name="itemCardActions" :project="project" />
          </template>
        </projects-list-grid-card>
      </d-grid>
    </template>
  </v-data-iterator>
</template>

<script>
  import DGrid from '@/components/Deipify/DGrid/DGrid';
  import { projectsView } from '@/components/Projects/List/mixins';
  import ProjectsListGridCard from '@/components/Projects/List/Grid/ProjectsListGridCard';
  export default {
    name: 'ProjectsListGrid',
    components: { ProjectsListGridCard, DGrid },
    mixins: [projectsView],
    props: {
      cardLayoutKey: {
        type: String,
        default: 'projectListCard'
      }
    }
  };
</script>
