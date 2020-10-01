<template>
  <research-list-item-renderer
    :schema="layoutSchema"
    :research="research$"
    tag="tr"
    @click.native="goToResearch()"
  />
</template>

<script>
  import { researchItem } from '@/components/ResearchList/ResearchListItem/mixins';

  export default {
    name: 'AdminProjectsItemRow',
    mixins: [researchItem],
    computed: {
      layoutSchema() {
        const { layout } = this.$tenantSettings.researchLayouts.AdminProjectListRow;

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
      goToResearch() {
        this.$router.push({
          name: 'research.details',
          params: {
            researchExternalId: this.research$.external_id
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
              self.$emit(event, self.research$.external_id);
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
