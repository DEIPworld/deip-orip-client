<template>
  <div v-if="internalContributions.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ text: $t('defaultNaming.all'), value: '' }, ...internalContributions]"
      outlined
      :label="$t('defaultNaming.filters.contributionType')"
      item-text="text"
      item-value="value"
      hide-details
    />

    <d-block
      v-if="!singleChoice"
      :title="$t('defaultNaming.filters.contributionType')"
      widget="compact"
    >
      <d-list-expand :active="internalContributions.length > 4">
        <template #default="{expanded}">
          <div class="mt-n2">
            <template v-for="(contribution, i) in internalContributions">
              <v-checkbox
                v-if="expanded || i < 4"
                :key="'domain-filter-' + i"
                v-model="internalValue"
                :label="contribution.text"
                :value="contribution.value"
                hide-details
                class="mt-2 mb-0"
              />
            </template>
          </div>
        </template>
      </d-list-expand>
    </d-block>
  </div>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { filterableMetrics, metricsMixin } from '@/components/EciMetrics/mixins';

  export default {
    name: 'DFilterTermContributions',

    components: {
      DBlock,
      DListExpand
    },

    mixins: [
      Proxyable,       
      metricsMixin,
      filterableMetrics
    ],

    props: {
      singleChoice: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
      };
    }
  };
</script>
