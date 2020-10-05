<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    v-bind="iteratorProps"
    @update:page="onUpdatePage"
  >
    <template #item="{ item }">
      <projects-list-table-row
        :key="item.externalId"
        :project="item"
        :layout-key="rowLayoutKey"
      >
        <template #itemRowActions="{ project }">
          <slot name="itemRowActions" :project="project" />
        </template>
      </projects-list-table-row>
    </template>
  </v-data-table>
</template>

<script>
  import { projectsView } from '@/components/Projects/List/mixins';
  import ProjectsListTableRow from '@/components/Projects/List/Table/ProjectsListTableRow';

  export default {
    name: 'ProjectsListTable',
    components: { ProjectsListTableRow },
    mixins: [projectsView],
    props: {
      rowLayoutKey: {
        type: String,
        default: 'projectListRow'
      }
    },
    computed: {
      headers() {
        const { layout } = this.$tenantSettings.researchLayouts[this.rowLayoutKey];
        const row = _.cloneDeep(layout[0]);

        if (row) {
          return [
            ...row.children.map((cell) => ({
              text: cell.attrs && cell.attrs.title ? cell.attrs.title : '',
              ...cell.attrs,
            })),
            ...(this.$scopedSlots.itemRowActions ? [{}] : [])
          ];
        }

        return [];
      }
    }
  };
</script>
