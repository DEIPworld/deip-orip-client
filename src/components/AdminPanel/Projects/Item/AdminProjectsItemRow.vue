<template>
  <project-list-item-renderer
    :schema="layoutSchema"
    :project="projectExtended"
    tag="tr"
    @click.native="goToProject()"
  />
</template>

<script>
  import { projectItem } from '@/features/Projects/components/List/mixins';

  export default {
    name: 'AdminProjectsItemRow',
    mixins: [projectItem],
    computed: {
      layoutSchema() {
        const { layout } = this.$portalSettings.layouts.AdminProjectListRow;

        const row = _.cloneDeep(layout[0]);

        if (row) {
          for (const cell of row.children) {
            delete cell.attrs.title;
          }
          row.children.push({
            component: 'td',
            class: 'text-right',
            children: [
              {
                component: 'CrudActions',
                props: {
                  row: true
                },
                children: [
                  this.grudAction('delete', 'click:delete'),
                  this.grudAction('edit', 'click:edit'),
                ]
              }
            ]
          });

          return row.children;
        }
        return layout;
      }
    },
    methods: {
      goToProject() {
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: this.projectExtended._id
          }
        });
      },

      grudAction(icon, event) {
        const self = this;
        return {
          component: 'VBtn',
          props: {
            icon: true,
            small: true
          },
          on: {
            click(e) {
              e.stopPropagation();
              self.$emit(event, self.projectExtended._id);
            }
          },
          children: [
            {
              component: 'VIcon',
              text: icon
            }
          ]
        };
      }
    }
  };
</script>
