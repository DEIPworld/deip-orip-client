<template>
  <div v-if="$ready">

    <portal :to="filterPos">
      <eci-metrics-filter
        v-model="filter"
        :disciplines="internalDisciplines"
        :contributions="internalContributions"
        :criterias="internalCriterias"
        :loading="loading"
        @apply="updateData"
      />
    </portal>

    <portal-target :name="`${$vnode.tag}-filterPlaceholderTop`" slim />

    <eci-metrics-stats
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
      :chart-options="chartOptions"
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
  import { mapGetters } from 'vuex';
  import { upperFirst } from 'vuetify/lib/util/helpers';
  import EciMetricsHistory from '@/components/EciMetrics/EciMetricsHistory/EciMetricsHistory';
  import EciMetricsStats from '@/components/EciMetrics/EciMetricsStats/EciMetricsStats';

  export default {
    name: 'EciMetrics',
    components: {
      EciMetricsStats,
      EciMetricsHistory,
      EciMetricsFilter
    },
    props: {

      // settings
      filterPosition: {
        type: [String, Boolean],
        default: 'history'
      },
      enableFilter: {
        type: Boolean,
        default: true
      },
      enableStats: {
        type: Boolean,
        default: false
      },
      enableChart: {
        type: Boolean,
        default: true
      },
      enableTable: {
        type: Boolean,
        default: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
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
      },

      //

      contentId: {
        type: String,
        default: undefined
      },

      researchId: {
        type: String,
        default: undefined
      },

      accountName: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        filter: {
          discipline: '',
          date: [],
          contribution: '',
          criteria: ''
        },

        loading: true
      };
    },

    computed: {
      ...mapGetters({
        expertiseHistory: 'eci/expertiseHistory',
        expertiseStats: 'eci/expertiseStats'
      }),

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
    },

    created() {
      Promise.all([
        this.updateData()
      ])
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      setLoading(state = true) {
        this.loading = state;
      },

      updateContentEci(filter) {
        return this.$store.dispatch('eci/getResearchContentExpertiseHistory', {
          external_id: this.contentId,
          filter
        })
          .then(() => {
            this.setLoading(false);
          });
      },

      updateResearchEci(filter) {
        return this.$store.dispatch('eci/getResearchExpertiseHistory', {
          external_id: this.researchId,
          filter
        })
          .then(() => {
            this.setLoading(false);
          });
      },

      updateAccountEci(filter) {
        return Promise.all([
          this.$store.dispatch('eci/getAccountExpertiseHistory', {
            external_id: this.accountName,
            filter
          }),
          ...(
            this.enableStats
              ? [this.$store.dispatch('eci/getAccountExpertiseStats', {
                username: this.accountName,
                filter
              })]
              : []
          )
        ])
          .then(() => {
            this.setLoading(false);
          });
      },

      updateDisciplineEci(filter) {
        return this.$store.dispatch('eci/getDisciplineExpertiseHistory', filter)
          .then(() => {
            this.setLoading(false);
          });
      },

      updateData(filter = {}) {
        this.setLoading(true);

        if (this.contentId) {
          return this.updateContentEci(filter);
        }

        if (this.researchId) {
          return this.updateResearchEci(filter);
        }

        if (this.accountName) {
          return this.updateAccountEci(filter);
        }

        return this.updateDisciplineEci(filter);
      }
    }
  };
</script>
