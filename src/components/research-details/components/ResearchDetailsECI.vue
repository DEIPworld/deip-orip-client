<template>
  <v-layout column class="my-5">
    <v-layout row align-baseline>
      <v-flex grow>
        <v-layout>
          <div class="pr-3">
            <v-icon large color="grey lighten-2">mdi-poll-box</v-icon>
          </div>
          <div class="rd-block-header align-self-center">Expertise Contribution Index</div>
        </v-layout>
      </v-flex>
      <v-flex shrink>
        <v-select
          class="my-0 py-0"
          v-model="selectedEciDisciplineId"
          :items="research.disciplines"
          item-text="name"
          item-value="id"
          label="Discipline"
          outline
          dense
          @change="selectEciDiscipline()"
          :disabled="eciHistoryRecordsTable.loading"
        ></v-select>
      </v-flex>
    </v-layout>

    <v-layout row>
      <div class="full-width" v-if="eciDisciplineHistoryRecordsChart">
        <GChart
          type="LineChart"
          :settings="{ packages: ['corechart'] }"
          :data="eciDisciplineHistoryRecordsChart.data"
          :options="eciDisciplineHistoryRecordsChart.options"
        />
      </div>
    </v-layout>

    <v-layout row v-if="hasEciDisciplineHistoryRecords">
      <div class="full-width">
        <v-data-table
          :headers="eciHistoryRecordsTable.headers"
          :items="eciHistoryRecordsTable.items"
          class="elevation-0 mt-3"
          disable-initial-sort
          :loading="eciHistoryRecordsTable.loading"
          :rows-per-page-items="[5, 10]"
          :pagination.sync="eciHistoryRecordsTable.pagination"
          :total-items="eciHistoryRecordsTable.totalItems"
        >
          <template v-slot:items="props">
            <td>
              <v-chip
                :color="eciHistoryRecordsTable.actionsColorMap[props.item.action]"
                text-color="white"
              >
                <span class="bold">{{ props.item.actionText.toUpperCase() }}</span>
              </v-chip>
            </td>
            <td>
              <router-link
                v-if="props.item.meta.link"
                class="a"
                :to="props.item.meta.link"
              >{{props.item.meta.title}}</router-link>
              <span v-else class="body-2">{{props.item.meta.title}}</span>
            </td>
            <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
            <td class="text-xs-center">
              <div
                class="half-bold"
                :class="{ 'eci-up': props.item.delta > 0, 'eci-down': props.item.delta < 0 }"
              >{{ props.item.delta }}</div>
            </td>
            <td class="text-xs-center">
              <div>{{ props.item.newAmount }}</div>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "ResearchDetailsECI",

  data() {
    return {
      selectedEciDisciplineId: null,
      eciHistoryRecordsTable: {
        headers: [
          { text: "Type", align: "left", sortable: false },
          { text: "Title", align: "left", sortable: false },
          { text: "Date", align: "center", sortable: false },
          { text: "Reward ECI", align: "center", sortable: false },
          { text: "Total ECI", align: "center", sortable: false }
        ],
        actionsColorMap: {
          review: "#161F63",
          vote_for_review: "#5ABAD1",
          init: "#8DDAB3"
        },
        pagination: {
          page: 1,
          rowsPerPage: 5
        },
        items: [],
        totalItems: 0,
        loading: false
      }
    };
  },
  computed: {
    ...mapGetters({
      research: "rd/research"
    }),
    hasEciDisciplineHistoryRecords() {
      let records = this.$store.getters["rd/eciHistoryByDiscipline"](
        this.selectedEciDisciplineId
      );
      return records != null && records.length != 0;
    },
    eciDisciplineHistoryRecordsChart() {
      let disciplineId = this.selectedEciDisciplineId;
      let records = this.$store.getters["rd/eciHistoryByDiscipline"](
        disciplineId
      );
      if (!records) return null;

      const getPointTooltipHtml = (eci, action, delta) => {
        let assessmentType = delta >= 0 ? "Approved" : "Rejected";
        let assessmentClass =
          delta >= 0
            ? "green--text text--lighten-4"
            : "red--text text--lighten-4";
        return `
          <div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">${action}</div>
              ${
                eci != 0
                  ? `<div class="${assessmentClass} bold">${assessmentType}</div>`
                  : ""
              } 
              ${
                delta != 0
                  ? `<div class="white--text">${
                      delta > 0 ? "+" : "-"
                    } ${delta}</div>`
                  : ""
              }
          </div>
        `;
      };

      const data = records.map((record, i) => {
        let date = new Date(record.timestamp);
        let value = record.newAmount;
        let delta = record.delta;
        let actionText = record.actionText;
        let tooltip = getPointTooltipHtml(value, actionText, delta);
        return [date, value, tooltip];
      });

      const now = moment().toDate();
      const lastEciValue = records.length
        ? records[records.length - 1].newAmount
        : 0;

      return {
        data: [
          [
            "Date",
            "Value",
            { type: "string", role: "tooltip", p: { html: true } }
          ],
          [
            moment(this.research.created_at).toDate(),
            0,
            `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">Project Created</div>
            </div>`
          ],
          ...data,
          [
            now,
            lastEciValue,
            `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">Now</div>
            </div>`
          ]
        ],

        options: {
          title: "",
          backgroundColor: {
            fill: "#ffffff"
          },
          legend: {
            position: "none"
          },
          chartArea: {
            right: 0,
            top: "10%",
            width: "90%"
          },
          tooltip: { isHtml: true },
          explorer: {
            actions: ["dragToZoom", "rightClickToReset"],
            axis: "horizontal",
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        }
      };
    }
  },
  methods: {
    selectEciDiscipline() {
      let disciplineId = this.selectedEciDisciplineId;
      let researchId = this.research.id;
      this.eciHistoryRecordsTable.loading = true;
      let cachedRecords = this.$store.getters["rd/eciHistoryByDiscipline"](
        disciplineId
      );
      if (cachedRecords == null) {
        this.$store
          .dispatch("rd/loadResearchEciHistoryRecords", {
            researchId,
            disciplineId
          })
          .then(() => {
            let records = this.$store.getters["rd/eciHistoryByDiscipline"](
              disciplineId
            );
            this.eciHistoryRecordsTable.items = records.reverse();
            this.eciHistoryRecordsTable.pagination.page = 1;
            this.eciHistoryRecordsTable.loading = false;
          });
      } else {
        this.eciHistoryRecordsTable.items = cachedRecords.reverse();
        this.eciHistoryRecordsTable.pagination.page = 1;
        this.eciHistoryRecordsTable.loading = false;
      }
    }
  },
  created() {
    let discipline = this.research.disciplines[0];
    this.selectedEciDisciplineId = discipline.id;
    this.selectEciDiscipline(discipline.id);
  }
};
</script>

<style lang="less" scoped>
.eci-up {
  background-color: #b8ddc8;
}

.eci-down {
  background-color: #ffbdbd;
}
.rd-block-header {
  font-family: Muli;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.25px;
  color: black;
}
</style>