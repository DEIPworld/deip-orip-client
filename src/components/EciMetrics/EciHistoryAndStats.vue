<template>
  <div>
    <eci-filter
      v-model="filterModel"
      :disciplines="internalDisciplines"
      :contributions="internalContributions"
      :criterias="internalCriterias"
      :loading="!$ready"
    />

    <d-block :title="$t('defaultNaming.eci.overview')" class="mt-12">
      <v-row class="align-center mt-n6">
        <v-col cols="3">
          <eci-history-contributions-chart
            :data="expertiseHistory"
            :loading="!$ready"
          />
        </v-col>
        <v-col>
          <eci-stats-info
            :data="expertiseStats"
          />
        </v-col>
      </v-row>
    </d-block>

    <d-block :title="$t('defaultNaming.eci.eci')" class="mt-12">
      <eci-history-chart
        :data="expertiseHistory"
        :loading="!$ready"
      />
      <eci-history-table
        :data="expertiseHistory"
        :loading="!$ready"
      />
    </d-block>
  </div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { eciHistoryStore } from '@/components/EciMetrics/EciHistory/store';
  import { eciStatsStore } from '@/components/EciMetrics/EciStats/store';
  import { mapState } from 'vuex';
  import { filterableMetrics, metricsMixin } from '@/components/EciMetrics/mixins';
  import EciHistoryChart from '@/components/EciMetrics/EciHistory/EciHistoryChart';
  import EciHistoryTable from '@/components/EciMetrics/EciHistory/EciHistoryTable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciFilter from '@/components/EciMetrics/EciFilter/EciFilter';
  import EciHistoryContributionsChart from '@/components/EciMetrics/EciHistory/EciHistoryContributionsChart';
  import deepmerge from 'deepmerge';
  import EciStatsInfo from '@/components/EciMetrics/EciStats/EciStatsInfo';

  export default {
    name: 'EciHistoryAndStats',
    components: {
      EciStatsInfo,
      EciHistoryContributionsChart,
      EciFilter,
      DBlock,
      EciHistoryTable,
      EciHistoryChart
    },
    mixins: [
      componentStoreFactory(deepmerge(eciHistoryStore, eciStatsStore)),
      metricsMixin,
      filterableMetrics
    ],
    computed: {
      ...mapState({
        expertiseHistory(state, getters) { return getters[`${this.storeNS}/expertiseHistory`]; },
        expertiseStats(state, getters) { return getters[`${this.storeNS}/expertiseStats`]; }
      })
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch(`${this.storeNS}/getExpertiseHistory`, this.payload),
          this.$store.dispatch(`${this.storeNS}/getExpertiseStats`, this.payload)
        ])
          .then(() => {
            this.$setReady(true);
          });
      }
    }
  };
</script>
