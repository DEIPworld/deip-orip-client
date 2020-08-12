<template>
  <v-row class="align-center">
    <v-col>
      <v-sheet :max-width="660" class="mx-auto">
        <v-row>
          <v-col>
            <div class="text-h5 text-center">
              {{ data.eci | checkVal | commaNumber }}
            </div>
            <v-divider class="my-3" />
            <div class="text-body-1 grey--text text-center">
              ECI
            </div>
          </v-col>

          <v-col>
            <div class="text-h5 text-center">
              {{ data.percentile_rank | checkVal }}
            </div>
            <v-divider class="my-3" />
            <div class="text-body-1 grey--text text-center">
              Percentile rank
            </div>
          </v-col>

          <v-col>
            <div
              class="text-h5 text-center"
              :class="data.growth_rate | numDirClass"
            >
              {{ data.growth_rate | checkVal | numDir }}
            </div>
            <v-divider class="my-3" />
            <div class="text-body-1 grey--text text-center">
              Growth rate
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>

    <v-col cols="3">
      <v-list>
        <template v-for="(item, index) of lowStats">
          <v-list-item :key="'lsk' + index" class="px-0">
            <v-list-item-content class="text-body-2 text--secondary">
              {{ item.label }}
            </v-list-item-content>
            <v-list-item-action-text class="text-body-2 text--primary font-weight-medium">
              {{ item.value }}
            </v-list-item-action-text>
          </v-list-item>
          <v-divider v-if="index + 1 < lowStats.length" :key="'lskd' + index" />
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'EciMetricsStatsInfo',
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      lowStats() {
        return [
          ...(
            this.data.contributions && this.data.contributions.length
              ? [{
                label: 'Contributions',
                value: this.data.contributions.length
              }]
              : []
          ),
          ...(
            this.data.researches && this.data.researches.length
              ? [{
                label: 'Citations',
                value: this.data.researches.length
              }]
              : []
          ),
          ...(
            this.data.researches && this.data.researches.length
              ? [{
                label: 'H-index',
                value: this.data.researches.length
              }]
              : []
          )
        ];
      }
    },

    methods: {
      checkVal(val) {
        return val || '—';
      },
      numUp(val) {
        return parseFloat(val) >= 0;
      },
    }
  };
</script>
