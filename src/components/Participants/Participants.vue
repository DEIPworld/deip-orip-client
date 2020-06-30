<template>
  <app-layout v-if="$ready">
    <v-navigation-drawer v-model="isShowFilter" app clipped right>
      <v-row no-gutters class="pa-4 grey lighten-3 v-list-iten">
        <v-col cols="auto" align-self="center" class="text-subtitle-1 font-weight-medium">
          Filters
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            text
            small
            icon
            color="black"
            @click="isShowFilter = !isShowFilter"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="filter.name"
              filled
              prepend-inner-icon="search"
              hide-details
              label="Search by names"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-select
              v-model="filter.discipline"
              :items="disciplines"
              filled
              hide-details
              label="Disciplines"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-select
              v-model.number="filter.contribution"
              :items="contributions"
              filled
              hide-details
              label="Contribution type"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-select
              v-model.number="filter.criteria"
              :items="criterias"
              filled
              hide-details
              label="Assessment criteria"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="justify-space-between mt-2">
          <v-btn
            height="40"
            small
            text
            color="primary"
            @click="clearFilter"
          >
            Clear
          </v-btn>
          <v-spacer />
          <v-btn
            height="40"
            small
            color="primary"
            @click="filterData"
          >
            Show results
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <layout-section>
      <v-toolbar dense>
        <v-toolbar-title class="text-h6">
          Participants
        </v-toolbar-title>
        <v-spacer />
        <v-btn outlined color="primary" @click="isShowFilter = !isShowFilter">
          <v-badge
            v-if="isShowBadge"
            color="amber lighten-1"
            overlap
            dot
            offset-y="5"
            offset-x="10"
          >
            <v-icon left>
              filter_list
            </v-icon>
          </v-badge>
          <v-icon v-else left>
            filter_list
          </v-icon>
          Filter
        </v-btn>
      </v-toolbar>
      <v-divider class="my-4" />
      <content-block>
        <v-data-table
          v-custom="'hover-row'"
          :hide-default-footer="participantsList.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"
          :headers="participantsHeader"
          :items="participantsList"
          sort-by="created_at"
          sort-desc
        >
          <template #item.user.profile.firstName="{ item: { user } }">
            <v-row no-gutters>
              <v-col cols="auto" align-self="center">
                <v-avatar size="24">
                  <img v-if="user.profile" :src="user.profile | avatarSrc(2 * 20, 2 * 20, false)">
                </v-avatar>
              </v-col>
              <v-col class="text-caption font-weight-medium ml-2">
                <div>{{ user | fullname }}</div>
                <div>{{ user.profile.employment[0] ? user.profile.employment[0].position : '' }}</div>
              </v-col>
            </v-row>
          </template>
          <template #item.eci="{ item: { eci } }">
            {{ eci }} ECI
          </template>
          <template #item.growth_rate="{ item: { growth_rate } }">
            <span
              :class="growthRateIsUp(growth_rate) ? 'green--text' : 'red--text'"
            >{{ growth_rate }}</span>
          </template>
        </v-data-table>
      </content-block>
    </layout-section>
  </app-layout>
</template>

<script>
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';

  import {
    EXPERTISE_CONTRIBUTION_TYPE,
    ASSESSMENT_CRITERIA_TYPE
  } from '@/variables';

  import { mapGetters } from 'vuex';

  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import AppLayout from '@/components/layout/components/Layout';

  const getValues = (obj) => Object.keys(obj).reduce((arr, it) => {
    if (typeof obj[it] === 'string') {
      let itName = (obj[it][0] + obj[it].slice(1).toLowerCase()).replace(
        '_',
        ' '
      );
      if (itName === 'Unknown') {
        itName = 'All';
      }
      return [
        ...arr,
        {
          text: itName,
          value: +it
        }
      ];
    }
    return arr;
  }, []);

  export default {
    name: 'Participants',
    components: { LayoutSection, ContentBlock, AppLayout },
    data() {
      return {
        isShowFilter: true,
        disciplines: [
          { text: 'All', value: disciplinesService.disciplineTree.id },
          ...disciplinesService
            .getTopLevelNodes()
            .map((d) => ({ text: d.label, value: d.id }))
        ],
        contributions: getValues(EXPERTISE_CONTRIBUTION_TYPE),
        criterias: getValues(ASSESSMENT_CRITERIA_TYPE),
        defaultFilter: {
          name: '',
          discipline: disciplinesService.disciplineTree.id,
          contribution: 0,
          criteria: 0
        },
        filter: {
          name: '',
          discipline: disciplinesService.disciplineTree.id,
          contribution: 0,
          criteria: 0
        },
        participantsHeader: [
          {
            text: 'Name',
            value: 'user.profile.firstName'
          },
          {
            text: 'Total ECI',
            value: 'eci',
            align: 'center',
            width: '15%'
          },
          {
            text: 'Percentile',
            value: 'percentile_rank',
            align: 'center',
            width: '15%'
          },
          {
            text: 'Growth rate',
            value: 'growth_rate',
            align: 'center',
            width: '15%'
          },
          {
            text: 'Сontributions number',
            value: 'contributions.length',
            align: 'center',
            width: '15%'
          },
          {
            text: 'Projects number',
            value: 'researches.length',
            align: 'center',
            width: '15%'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        participantsList: 'participants/participants'
      }),
      isShowBadge() {
        return !_.isEqual(this.filter, this.defaultFilter);
      }
    },
    created() {
      if (this.$route.query.discipline) {
        this.filter.discipline = this.$route.query.discipline;
      }
      if (this.$route.query.contribution) {
        this.filter.contribution = +this.$route.query.contribution;
      }
      if (this.$route.query.criteria) {
        this.filter.criteria = +this.$route.query.criteria;
      }
      if (this.$route.query.name) {
        this.filter.name = this.$route.query.name;
      }

      this.$store
        .dispatch('participants/loadAllParticipants', { filter: this.filter })
        .then(() => {
          this.$setReady();
        });
    },
    methods: {
      filterData() {
        this.$store.dispatch('participants/loadFilterParticipants', {
          filter: this.filter
        });
      },
      clearFilter() {
        this.filter = _.cloneDeep(this.defaultFilter);
      },
      growthRateIsUp(rate) {
        return rate.slice(0, -2) >= 0;
      }
    }
  };
</script>
