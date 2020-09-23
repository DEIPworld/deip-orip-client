<template>
  <v-card
    class="d-flex flex-column pa-6"
    outlined
    :to="{
      name: 'research.details',
      params: {
        researchExternalId: research.external_id
      }
    }"
  >
    <research-list-card-renderer
      class="d-flex flex-column flex-shrink-1 flex-grow-1"
      :schema="layoutSchema"
      :research="research$"
    />
  </v-card>
</template>

<script>
  import ResearchListCardRenderer
    from '@/components/ResearchList/ResearchListItem/ResearchListCard/ResearchListCardRenderer';
  import { researchAttributesToObject } from '@/utils/helpers';

  export default {
    name: 'ResearchListCard',
    components: { ResearchListCardRenderer },
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      layoutSchema() {
        return this.$tenantSettings.researchLayouts.researchCard.layout;
      },
      research$() {
        return {
          ...this.research,
          ...{
            researchRef: {
              attributes: researchAttributesToObject(this.research.researchRef.attributes)
            }
          }
        };
      }
    }
  };
</script>
