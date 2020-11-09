<template>
  <v-skeleton-loader
    type="grid"
    :loading="loading"
    transition="fade-transition"
    :types="SKELETONS"
  >
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
  </v-skeleton-loader>
</template>

<script>
  import { projectsView } from '@/features/Projects/mixins';
  import { SKELETONS } from '@/variables';

  import DGrid from '@/components/Deipify/DGrid/DGrid';
  import ProjectsListGridCard from '@/features/Projects/components/List/Grid/ProjectsListGridCard';

  export default {
    name: 'ProjectsListGrid',
    components: {
      ProjectsListGridCard,
      DGrid
    },
    mixins: [projectsView],
    props: {
      cardLayoutKey: {
        type: String,
        default: 'projectListCard'
      }
    },
    data() {
      return {
        SKELETONS
      };
    }
  };
</script>
