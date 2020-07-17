<template>
  <tr
    :class="$style.host"
    @click="$router.push(itemRoute)"
  >
    <td class="pr-0">
      <v-avatar :size="40">
        <v-img
          :src="$options.filters.researchBackgroundSrc(research.external_id, 400, 200)"
        />
      </v-avatar>
    </td>

    <td width="40%" class="pl-3">
      <research-list-title :title="research.title" compact />
    </td>

    <td>
      <research-list-author :author="research.research_group" />
    </td>

    <td>
      <research-list-criterias
        v-if="research.researchRef && research.researchRef.tenantCriteriasReadingList"
        :criterias="research.researchRef.tenantCriteriasReadingList"
      />
    </td>

    <td width="260px">
      <research-list-token-sale
        v-if="research.tokenSale"
        :token-sale="research.tokenSale"
      />
    </td>

    <td class="text-no-wrap">
      <d-meta-item
        :meta="{icon: 'event', label: moment(research.last_update_time).format('D MMM YYYY')}"
      />
    </td>

    <td width="0">
      <d-meta-item
        :meta="{icon: 'chat_bubble_outline', label: reviewsCount}"
      />
    </td>
  </tr>
</template>

<script>
  import { abstractResearchItem } from '@/components/ResearchList/abstractResearchItem';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'ResearchListRow',
    components: { DMetaItem },
    mixins: [abstractResearchItem]
  };
</script>

<style module lang="scss">
  .host {
    cursor: pointer;
    td {
      height: auto !important;
      padding: 8px 16px !important;
    }
  }
</style>
