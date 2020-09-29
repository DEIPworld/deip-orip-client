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
        return this.$tenantSettings.researchLayouts.projectListRow.layout
          .map((el) => ({
            component: 'td',
            attrs: {
              width: `${100 / this.$tenantSettings.researchLayouts.projectListRow.layout.length}%`
            },
            children: [el]
          }));
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
