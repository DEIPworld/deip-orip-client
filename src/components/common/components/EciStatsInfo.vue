<template>

  <d-block sm title="Expertise Contribution Index">

    <template v-if="eciStatsByDiscipline">
      <div class="d-flex mb-2  text-caption">
        <div class="flex-basis-0 flex-grow-1">Total ECI</div>
        <div class="flex-basis-0 flex-grow-1 font-weight-medium">{{ `${eciStatsByDiscipline.eci}` | commaNumber }}</div>
      </div>

      <div class="d-flex mb-2  text-caption">
        <div class="flex-basis-0 flex-grow-1">Percentile rank</div>
        <div class="flex-basis-0 flex-grow-1 font-weight-medium">{{ eciStatsByDiscipline.percentile_rank }}</div>
      </div>

      <div v-if="eciStatsByDiscipline.growth_rate" class="d-flex mb-6  text-caption">
        <div class="flex-basis-0 flex-grow-1">Growth rate</div>
        <div
          class="flex-basis-0 flex-grow-1 font-weight-medium"
          :class="growthRateIsUp(eciStatsByDiscipline.growth_rate) ? 'green--text' : 'red--text'"
        >
          {{ growthRateIsUp(eciStatsByDiscipline.growth_rate) ? `+${eciStatsByDiscipline.growth_rate}` : eciStatsByDiscipline.growth_rate }}
        </div>
      </div>
    </template>

    <v-card outlined class="py-0">
      <v-list class="py-0">
        <template v-for="(item, i) in expertise">
          <v-list-item :key="`eci-${i}`" class="text-caption">
            <v-list-item-content class="font-weight-medium">
              <div class="d-flex justify-space-between text-caption">
                <div>
                  {{ item.discipline_name || item.disciplineName }}
                </div>
                <div>
                  ECI {{ `${eci(item.eci || item.value )}` | commaNumber }}
                </div>
              </div>

              <div class="d-flex justify-space-between">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <div
                      v-on="on"
                    >
                      {{ item.percentile_rank }}
                    </div>
                  </template>
                  <span>Percentile rank</span>
                </v-tooltip>
                <v-tooltip v-if="item.growth_rate" top>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" :class="growthRateIsUp(item.growth_rate) ? 'green--text' : 'red--text'">
                      {{ growthRateIsUp(item.growth_rate) ? `+${item.growth_rate}` : item.growth_rate }}
                    </div>
                  </template>
                  <span>Growth rate</span>
                </v-tooltip>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i + 1 < expertise.length" :key="`eci-divider-${i}`" />
        </template>
      </v-list>
    </v-card>

    <v-btn
      block
      color="primary"
      class="mt-3"
      v-if="accountName"
      :to="goToExpertiseDetails()"
    >
      More details
    </v-btn>

  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  export default {
    name: 'EciStatsInfo',
    components: { DBlock },
    props: {
      expertise: {
        type: Array,
        required: true
      },
      eciStatsByDiscipline: {
        type: Object,
        default: null
      },
      accountName: {
        type: String,
        default: ''
      }
    },

    methods: {
      goToExpertiseDetails() {
        if (this.$route.path.includes('/account')) {
          return {
            name: 'account.expertiseDetails'
          };
        }
        if (this.$route.path.includes('/user-details')) {
          return {
            name: 'UserExpertiseDetails',
            params: {
              account_name: this.accountName
            }
          };
        }
        if (this.$route.path.includes('/research')) {
          return {

          };
        }
        if (this.$route.path.includes('/group-details')) {
          return {

          };
        }
      },
      eci(value) {
        if (value !== undefined) {
          return `${value}`;
        }
        return '0';
      },
      growthRateIsUp(rate) {
        return parseFloat(rate) >= 0;
      }
    }
  }
</script>
