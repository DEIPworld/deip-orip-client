<template>
  <div v-if="$ready">
    <portal :to="filterPos">
      <eci-metrics-filter
        v-model="filterModel"
        :disciplines="internalDisciplines"
        :contributions="internalContributions"
        :criterias="internalCriterias"
        :loading="loading"
        @apply="updateData"
      />
    </portal>

    <portal-target :name="`${$vnode.tag}-filterPlaceholderTop`" slim />
    <eci-metrics-stats
      v-if="enableStats"
      :data="{expertiseStats, expertiseHistory}"
      :portal-key="$vnode.tag"
    >
      <template #title>
        <slot name="statsTitle" />
      </template>
      <template #subtitle>
        <slot name="statsSubtitle" />
      </template>
      <template #titleAddon>
        <slot name="statsTitleAddon" />
      </template>
    </eci-metrics-stats>

    <eci-metrics-history
      :data="expertiseHistory"
      :portal-key="$vnode.tag"
    >
      <template #title>
        <slot name="historyTitle" />
      </template>
      <template #subtitle>
        <slot name="historySubtitle" />
      </template>
      <template #titleAddon>
        <slot name="historyTitleAddon" />
      </template>
    </eci-metrics-history>
  </div>
</template>

<script>

  import EciMetricsFilter from '@/components/EciMetrics/EciMetricsFilter';
  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';
  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
  import { ASSESSMENT_CRITERIA_TYPE, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { upperFirst } from 'vuetify/lib/util/helpers';
  import EciMetricsHistory from '@/components/EciMetrics/EciMetricsHistory/EciMetricsHistory';
  import EciMetricsStats from '@/components/EciMetrics/EciMetricsStats/EciMetricsStats';
  import { EciMetricsMixin } from './EciMetricsMixin';

  export default {
    name: 'EciMetrics',

    components: {
      EciMetricsStats,
      EciMetricsHistory,
      EciMetricsFilter
    },

    mixins: [
      EciMetricsMixin
    ],

    props: {

      filterPosition: {
        type: [String, Boolean],
        default: 'history'
      },

      enableFilter: {
        type: Boolean,
        default: true
      },

      // filterprops

      disciplines: {
        type: [Array, Boolean],
        default: () => getTopLevelNodes()
      },
      criterias: {
        type: [Array, Boolean],
        default: () => mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: 'All'
        })
      },
      contributions: {
        type: [Array, Boolean],
        default: () => mapSelectListFromEnum(EXPERTISE_CONTRIBUTION_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: 'All'
        })
      }
    },

    computed: {

      filterPos() {
        return `${this.$vnode.tag}-filterPlaceholder${upperFirst(this.filterPosition)}`;
      },

      internalDisciplines() {
        return this.disciplines
          .map((d) => ({
            external_id: d.external_id || d.id,
            label: d.label || d.name
          }));
      },

      internalCriterias() {
        return this.criterias;
      },

      internalContributions() {
        return this.contributions;
      }
    }
  };
</script>
