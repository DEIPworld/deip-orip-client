<template>
  <v-skeleton-loader
    type="table-tbody"
    :loading="loading"
    transition="fade-transition"
  >
    <v-data-table
      :headers="headers"
      :items="projects"
      disable-sort
      v-bind="iteratorProps"
      @update:page="onUpdatePage"
    >
      <template #item="{ item }">
        <projects-list-table-row
          :key="item._id"
          :project="item"
          :layout-key="rowLayoutKey"
        >
          <template #itemRowActions="{ project }">
            <slot name="itemRowActions" :project="project" />
          </template>
        </projects-list-table-row>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
  import { projectsView } from '@/features/Projects/mixins';
  import ProjectsListTableRow from '@/features/Projects/components/List/Table/ProjectsListTableRow';

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
        const { layout } = this.$portalSettings.layouts[this.rowLayoutKey];
        const row = _.cloneDeep(layout[0]);

        if (row) {
          return [
            ...row.children.map((cell) => ({
              text: cell.attrs && cell.attrs.title ? cell.attrs.title : '',
              ...cell.attrs
            })),
            ...(this.$scopedSlots.itemRowActions ? [{}] : [])
          ];
        }

        return [];
      }
    }
  };
</script>
