<template>
  <v-data-table
    :hide-default-footer="data.length < 10"
    :footer-props="{itemsPerPageOptions: [10, 20, 30, 40, 50, -1]}"
    :items-per-page="10"
    :headers="tableHeaders"
    :items="internalData"
  >
    <template v-slot:item.type="{ item }">
      <v-chip
        :color="contributionColor[item.contribution_type].background"
        :text-color="contributionColor[item.contribution_type].foreground"
      >
        {{ item.actionText }}
      </v-chip>
    </template>

    <template v-slot:item.title="{ item }">
      <router-link v-if="item.meta.link" class="a" :to="item.meta.link">
        {{ item.meta.title }}
      </router-link>
      <span v-else class="text-body-2">{{ item.meta.title }}</span>
    </template>

    <template v-slot:item.date="{ item }">
      <div class="text-no-wrap">
        {{ moment(item.timestamp).format('D MMM YYYY') }}
      </div>
    </template>

    <template v-slot:item.delta="{ item }">
      <div
        class="text-no-wrap rounded-sm"
        :class="{ 'success lighten-3': item.delta > 0, 'error lighten-3': item.delta < 0 }"
      >
        {{ item.delta }}
      </div>
    </template>

    <template v-slot:item.eci="{ item }">
      {{ item.eci }}
    </template>
  </v-data-table>
</template>

<script>
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { chartGradient, switchColor } from '@/plugins/charts';

  export default {
    name: 'EciMetricsHistoryTable',
    props: {
      data: {
        type: Array,
        default: () => ({})
      }
    },

    data() {
      const colors = chartGradient(4);

      return {
        tableHeaders: [
          {
            text: 'Type',
            align: 'left',
            value: 'type',
            sortable: false
          },
          {
            text: 'Title',
            align: 'left',
            value: 'title',
            sortable: false
          },
          {
            text: 'Date',
            align: 'center',
            value: 'date',
            sortable: false,
            class: 'white-space-nowrap'
          },
          {
            text: 'Reward ECI',
            align: 'center',
            sortable: false,
            value: 'delta',
            class: 'white-space-nowrap'
          },
          {
            text: 'Total ECI',
            align: 'center',
            sortable: false,
            value: 'eci',
            class: 'white-space-nowrap'
          }
        ],

        contributionColor: {
          [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN]: {
            background: colors[2],
            foreground: switchColor(colors[3])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: {
            background: colors[2],
            foreground: switchColor(colors[2])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: {
            background: colors[1],
            foreground: switchColor(colors[1])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: {
            background: colors[0],
            foreground: switchColor(colors[0])
          }
        }
      };
    },

    computed: {
      internalData() {
        return [...this.data.map((r, i) => ({ ...r, id: `${i}-${r.discipline_external_id}` }))].reverse();
      }
    }
  };
</script>
