<template>
  <v-layout row wrap class="my-5">
    <v-flex xs12>
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
            @change="loadDisciplineEciHistory"
            :disabled="eciHistoryRecordsTable.loading"
          ></v-select>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex xs12>
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
    </v-flex>

    <v-flex xs12>
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
                  :color="eciHistoryRecordsTable.contributionColor[props.item.alteration_source_type]"
                  text-color="white"
                >
                  <span class="bold uppercase">{{ props.item.actionText }}</span>
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
                <div>{{ props.item.eci }}</div>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { EXPERTISE_CONTRIBUTION_TYPE } from "@/variables";

export default {
  name: "ResearchDetailsECI",

  data() {
    return {
      selectedEciDisciplineId: null,
      eciHistoryRecordsTable: {
        headers: [
          {
            text: "Type",
            align: "left",
            sortable: false
          },
          {
            text: "Title",
            align: "left",
            sortable: false
          },
          {
            text: "Date",
            align: "center",
            sortable: false
          },
          {
            text: "Reward ECI",
            align: "center",
            sortable: false
          },
          {
            text: "Total ECI",
            align: "center",
            sortable: false
          }
        ],
        contributionColor: {
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: "#161F63",
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: "#5ABAD1",
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: "#8DDAB3"
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
      research: "rd/research",
      eciHistoryByDisciplineMap: "rd/eciHistoryByDisciplineMap"
    }),
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
        let value = record.eci;
        let delta = record.delta;
        let actionText = record.actionText;
        let tooltip = getPointTooltipHtml(value, actionText, delta);
        return [date, value, tooltip];
      });

      const now = moment().toDate();
      const lastEciValue = records.length ? records[records.length - 1].eci : 0;

      return {
        data: [
          [
            "Date",
            "Value",
            {
              type: "string",
              role: "tooltip",
              p: { html: true }
            }
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
    },
    hasEciDisciplineHistoryRecords() {
      let records = this.$store.getters["rd/eciHistoryByDiscipline"](
        this.selectedEciDisciplineId
      );
      return records != null && records.length != 0;
    }
  },
  methods: {
    loadDisciplineEciHistory() {
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
    },
    reloadDisciplineEciHistory() {
      let disciplineIds = Object.keys(this.eciHistoryByDisciplineMap);
      let promises = [];
      for (let i = 0; i < disciplineIds.length; i++) {
        let disciplineId = disciplineIds[i];
        promises.push(
          this.$store.dispatch("rd/loadResearchEciHistoryRecords", {
            researchId: this.research.id,
            disciplineId
          })
        );
      }
      return Promise.all(promises)
        .then(() => this.loadDisciplineEciHistory());
    }
  },
  created() {
    let discipline = this.research.disciplines[0];
    this.selectedEciDisciplineId = discipline.id;
    this.loadDisciplineEciHistory();
  }
};
</script>

<style scoped>
.rd-eci-item {
  border: 1px solid #bdbdbd;
  border-radius: 2px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #828282;
}

.eci-up {
  background-color: #b8ddc8;
}

.eci-down {
  background-color: #ffbdbd;
}
</style>