<template>
  <div v-if="assessmentCriterias.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ label: 'All', value: '' }, ...assessmentCriterias]"
      outlined
      label="Assessment criteria"
      item-text="label"
      item-value="value"
      hide-details
    />
    <d-block
      v-if="!singleChoice"
      title="Assessment criteria"
      widget="compact"
    >
      <d-list-expand :active="assessmentCriterias.length > 4">
        <template #default="{expanded}">
          <div class="mt-n2">
            <template v-for="(criteria, i) in assessmentCriterias">
              <v-checkbox
                v-if="expanded || i < 4"
                :key="'discipline-filter-' + i"
                v-model="internalValue"
                :label="criteria.label"
                :value="criteria.value"
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
  import { ASSESSMENT_CRITERIA_TYPE, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { sentenceCase } from 'change-case';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'DFilterTermAssessmentCriterias',

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
        assessmentCriterias: Object.keys(ASSESSMENT_CRITERIA_TYPE)
          .filter((x) => isNaN(x) && x !== 'UNKNOWN')
          .map((key) => ({
            label: sentenceCase(key),
            value: ASSESSMENT_CRITERIA_TYPE[key]
          }))
      };
    }
  };
</script>
