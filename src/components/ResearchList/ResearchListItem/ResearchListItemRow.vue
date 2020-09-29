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
    name: 'ResearchListItemRow',
    mixins: [researchItem],
    computed: {
      layoutSchema() {
        const { layout } = this.$tenantSettings.researchLayouts.projectListRow;
        const row = layout[0];
        return row ? row.children : layout;
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
