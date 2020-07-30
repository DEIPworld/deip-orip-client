<template>
  <div v-if="overviewData.overview" class="pb-4">
    <div class="font-weight-bold title">
      Overview
    </div>
    <div class="d-flex mt-4">
      <div class="px-2">
        <d-chart-pie
          donut
          :data="overviewData.overview.contributionsAllocation"
          :options="{
            legend: {alignment: 'center'}
          }"
        />
      </div>
      <div class="flex-grow-1">
        <v-row
          v-if="overviewData.eciStatsByDiscipline"
          no-gutters
          justify="center"
          justify-md="space-between"
          class="full-height"
        >
          <v-col cols="auto" class="d-flex mx-auto">
            <div v-if="overviewData.eciStatsByDiscipline.eci" class="d-flex">
              <div class="ma-auto flex-grow-1">
                <div class="text-h6 text-center">
                  {{ overviewData.eciStatsByDiscipline.eci | commaNumber }}
                </div>
                <v-divider class="my-3" />
                <div class="text-body-1 grey--text text-center">
                  ECI
                </div>
              </div>
            </div>
            <div v-if="overviewData.eciStatsByDiscipline.percentile_rank" class="d-flex mx-3">
              <div class="ma-auto flex-grow-1">
                <div class="text-h6 text-center">
                  <div>{{ overviewData.eciStatsByDiscipline.percentile_rank }}</div>
                </div>
                <v-divider class="my-3" />
                <div class="text-body-1 grey--text text-center">
                  Percentile rank
                </div>
              </div>
            </div>
            <div
              v-if="overviewData.eciStatsByDiscipline.growth_rate"
              class="d-flex"
              :class="growthRateIsUp(overviewData.eciStatsByDiscipline.growth_rate)
                ? 'green--text' : 'red--text'"
            >
              <div class="ma-auto flex-grow-1">
                <div class="text-h6 text-center">
                  {{ growthRateIsUp(overviewData.eciStatsByDiscipline.growth_rate)
                    ? `+${overviewData.eciStatsByDiscipline.growth_rate}`
                    : overviewData.eciStatsByDiscipline.growth_rate }}
                </div>
                <v-divider class="my-3" />
                <div class="text-body-1 grey--text text-center">
                  Growth rate
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="3" class="d-flex">
            <div class="align-self-center flex-grow-1">
              <div
                v-if="overviewData.eciStatsByDiscipline.contributions"
                class="text-body-2 text-center d-flex justify-space-between"
              >
                <span class="grey--text">Contributions</span>
                <span>{{ overviewData.eciStatsByDiscipline.contributions.length }}</span>
              </div>
              <v-divider v-if="overviewData.eciStatsByDiscipline.contributions" class="my-3" />
              <div
                v-if="overviewData.eciStatsByDiscipline.researches"
                class="text-body-2 text-center d-flex justify-space-between"
              >
                <span class="grey--text">Citations</span>
                <span>{{ overviewData.eciStatsByDiscipline.researches.length }}</span>
              </div>
              <v-divider v-if="overviewData.eciStatsByDiscipline.researches" class="my-3" />
              <div
                v-if="overviewData.eciStatsByDiscipline.researches"
                class="text-body-2 text-center d-flex justify-space-between"
              >
                <span class="grey--text">H-index</span>
                <span>{{ overviewData.eciStatsByDiscipline.researches.length }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
        <div v-else class="full-height">
          <div>No records found for specified filter</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DChartPie from '@/components/Deipify/DChart/DChartPie';

  export default {
    name: 'EciHistoryOverview',
    components: { DChartPie },
    props: {
      overviewData: {
        type: Object,
        required: true
      }
    },

    methods: {
      growthRateIsUp(rate) {
        return parseFloat(rate) >= 0;
      }
    }
  };
</script>
