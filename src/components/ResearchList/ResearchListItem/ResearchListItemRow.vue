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
  import { extendAttrModules } from '@/utils/helpers';

  export default {
    name: 'ResearchListItemRow',
    mixins: [researchItem],
    computed: {
      layoutSchema() {
        const { layout } = this.$tenantSettings.researchLayouts.projectListRow;

        const extendedLayout = extendAttrModules(
          layout,
          { props: { projectId: this.research.external_id } }
        );

        const row = _.cloneDeep(extendedLayout[0]);
        if (row) {
          for (const cell of row.children) {
            delete cell.attrs.title;
          }
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
      }
    }
  };
</script>
