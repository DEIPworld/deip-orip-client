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
    <research-list-item-renderer
      class="d-flex flex-column flex-shrink-1 flex-grow-1"
      :schema="layoutSchema"
      :research="research$"
    />
  </v-card>
</template>

<script>
  import { researchItem } from '@/components/ResearchList/ResearchListItem/mixins';

  export default {
    name: 'ResearchListItemCard',
    mixins: [researchItem]
  };
</script>
