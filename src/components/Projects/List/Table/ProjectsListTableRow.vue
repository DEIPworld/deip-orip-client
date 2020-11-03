<template>
  <project-list-item-renderer
    :schema="layoutSchemaExtended"
    :project="$$projectExtended"
    tag="tr"
    @click.native="goToProject()"
  >
    <template #itemRowActions>
      <slot name="itemRowActions" :project="$$projectExtended" />
    </template>

  </project-list-item-renderer>
</template>

<script>
  import ProjectListItemRenderer from '@/components/Projects/List/renderer';
  import { projectItem } from '@/components/Projects/List/mixins';

  export default {
    name: 'ProjectsListTableRow',
    components: {
      ProjectListItemRenderer
    },
    mixins: [projectItem],
    props: {
      layoutKey: {
        type: String,
        default: 'projectListCard'
      }
    },
    computed: {
      layoutSchemaExtended() {
        const layout = this.layoutSchema;

        const row = _.cloneDeep(layout[0]);

        if (row) {

          for (const cell of row.children) {
            delete cell.attrs.title;
          }

          if (this.$scopedSlots.itemRowActions) {
            row.children.push({
              component: 'td',
              slotName: 'itemRowActions'
            });
          }
          return row.children;
        }
        return layout;
      }
    },
    methods: {
      goToProject() {
        this.$router.push({
          name: 'research.details',
          params: {
            researchExternalId: this.$$projectExtended.externalId
          }
        });
      }
    }
  };
</script>
