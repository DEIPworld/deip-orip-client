<template>
  <v-card
    class="d-flex flex-column"
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
      :research="research"
    />
  </v-card>
</template>

<script>
  import { abstractResearchItem } from '@/components/ResearchList/ResearchListItem/abstractResearchItem';
  import ResearchListCardRenderer
    from '@/components/ResearchList/ResearchListItem/ResearchListCard/ResearchListCardRenderer';
  import { researchListCardSchema } from '@/components/ResearchList/ResearchListItem/ResearchListCard/researchListCardSchema';

  export default {
    name: 'ResearchListCard',
    components: { ResearchListCardRenderer },
    mixins: [abstractResearchItem],
    computed: {
      layoutSchema() {
        return researchListCardSchema;
      }
    }
  };
</script>
