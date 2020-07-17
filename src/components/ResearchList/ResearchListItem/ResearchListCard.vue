<template>
  <v-card
    class="d-flex flex-column"
    outlined
    :to="{
      name: $isUser ? 'ResearchDetails' : 'ResearchDetailsPublic',
      params: {
        research_group_permlink: encodeURIComponent(research.research_group.permlink),
        research_permlink: encodeURIComponent(research.permlink)
      }
    }"
  >
    <v-card-text class="py-4 text--primary">
      <div class="d-flex align-center">
        <research-list-author :author="research.research_group" />
        <research-list-status :status="research.is_finished ? 'success' : null" />
      </div>
    </v-card-text>

    <v-img
      :src="$options.filters.researchBackgroundSrc(research.external_id, 400, 200)"
      :aspect-ratio="2"
      class="flex-grow-0"
    />

    <v-card-text class="text--primary spacer">
      <research-list-title :title="research.title" />

      <research-list-token-sale
        v-if="research.tokenSale"
        class="mt-4"
        :token-sale="research.tokenSale"
      />

      <research-list-criterias
        v-if="research.researchRef && research.researchRef.tenantCriteriasReadingList"
        class="mt-4"
        :criterias="research.researchRef.tenantCriteriasReadingList"
      />

      <div
        v-if="research.researchRef && research.researchRef.tenantCategory && research.researchRef.tenantCategory.text"
        class="text-caption"
      >
        {{ research.researchRef.tenantCategory.text }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-text class="py-4">
      <d-meta-list
        class="justify-space-between"
        :list="[
          {icon: 'event', label: moment(research.last_update_time).format('D MMM YYYY')},
          {icon: 'chat_bubble_outline', label: reviewsCount}
        ]"
      />
    </v-card-text>
  </v-card>
</template>

<script>
  import { abstractResearchItem } from '@/components/ResearchList/abstractResearchItem';

  export default {
    name: 'ResearchListCard',
    mixins: [abstractResearchItem]
  };
</script>

<style scoped>

</style>
