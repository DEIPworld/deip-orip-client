<template>
  <div v-if="contributions.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ label: 'All', value: '' }, ...contributions]"
      outlined
      label="Contribution type"
      item-text="label"
      item-value="value"
    />

    <d-block
      v-if="!singleChoice"
      title="Contribution type"
      widget="compact"
    >
      <d-list-expand :active="contributions.length > 4">
        <template #default="{expanded}">
          <div class="mt-n2">
            <template v-for="(contribution, i) in contributions">
              <v-checkbox
                v-if="expanded || i < 4"
                :key="'discipline-filter-' + i"
                v-model="internalValue"
                :label="contribution.label"
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
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { sentenceCase } from 'change-case';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'DFilterTermContributions',

    components: {
      DBlock,
      DListExpand
    },

    mixins: [Proxyable],

    props: {
      singleChoice: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        contributions: Object.keys(EXPERTISE_CONTRIBUTION_TYPE)
          .filter((x) => isNaN(x) && x !== 'UNKNOWN')
          .map((key) => ({
            label: sentenceCase(key),
            value: EXPERTISE_CONTRIBUTION_TYPE[key]
          }))
      };
    }
  };
</script>
