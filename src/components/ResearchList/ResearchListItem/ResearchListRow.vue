<template>
  <tr
    :class="$style.host"
    @click="$router.push(itemRoute)"
  >

    <td width="33%">
      <d-avatared
        :src="research.external_id | researchBackgroundSrc(40,40)"
        :size="40"
        :tooltip="research.title"
      >
        <div class="text-body-2 font-weight-medium">{{ research.title }}</div>
      </d-avatared>
    </td>

    <td>
      <research-list-group :group="research.research_group" />
    </td>

    <td>
      <research-list-criterias
        v-if="research.researchRef && research.researchRef.tenantCriteriasReadingList"
        :criterias="research.researchRef.tenantCriteriasReadingList"
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

    <td width="260px">
      <research-list-token-sale
        v-if="research.tokenSale"
        :token-sale="research.tokenSale"
      />
    </td>

    <td width="0">
      <research-list-status :status="research.is_finished ? 'finished' : null" />
    </td>
  </tr>
</template>

<script>
  import { abstractResearchItem } from '@/components/ResearchList/ResearchListItem/abstractResearchItem';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DAvatared from '@/components/Deipify/DAvatared/DAvatared';

  export default {
    name: 'ResearchListRow',
    components: { DAvatared, DMetaItem },
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
