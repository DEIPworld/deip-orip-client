<template>
  <tr
    :class="$style.host"
    @click="$router.push(itemRoute)"
  >
    <td width="33%">
      <d-simple-tooltip :tooltip="research.title">
        <d-box-item
          :avatar="research.external_id | researchBackgroundSrc(40 * 2,40 * 2)"
          :size="40"
        >
          <div class="text-body-2 font-weight-medium">
            {{ research.title }}
          </div>
        </d-box-item>
      </d-simple-tooltip>
    </td>

    <td>
      <research-list-group :group="research.research_group" />
    </td>

    <td>
      <attributes-read
        v-for="(attribute, index) of research.researchRef.attributes"
        :key="`attr-${index}`"
        :value="attribute"
        :attribute-id="attribute.researchAttributeId"
        small
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
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import AttributesRead from '@/components/Attributes/AttributesRead';

  export default {
    name: 'ResearchListRow',
    components: { AttributesRead, DSimpleTooltip, DBoxItem, DMetaItem },
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
