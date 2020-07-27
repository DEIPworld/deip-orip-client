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
              v-model="filter.searchTerm"
              outlined
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
              outlined
              hide-details
              label="Disciplines"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-select
              v-model="filter.contribution"
              :items="contributions"
              outlined
              hide-details
              label="Contribution type"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-select
              v-model="filter.criteria"
              :items="criterias"
              outlined
              hide-details
              label="Assessment criteria"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="justify-space-between mt-2">
          <v-btn
            height="32"
            small
            text
            color="primary"
            @click="clearFilter"
          >
            Clear
          </v-btn>
          <v-spacer />
          <v-btn
            height="32"
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
      <v-row no-gutters class="py-2">
        <v-col cols="auto" class="text-h6">
          Participants
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn height="32" outlined color="primary" @click="isShowFilter = !isShowFilter">
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
        </v-col>
      </v-row>
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
            <router-link
              :to="$store.getters['auth/user'].account.name === user.account.name ?
                {
                  name: 'account.expertiseDetails'
                }:{
                  name: 'UserExpertiseDetails',
                  params: {account_name: user.account.name}
                }"
              class="a"
            >
              <v-row no-gutters class="py-2">
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
            </router-link>
          </template>
          <template #item.eci="{ item: { eci } }">
            <span class="font-weight-bold">{{ `${eci}` | commaNumber }}</span> ECI
          </template>
          <template #item.growth_rate="{ item: { growth_rate } }">
            <span
              v-if="growth_rate"
              :class="growthRateIsUp(growth_rate) ? 'green--text' : 'red--text'"
            >{{ growthRateIsUp(growth_rate) ? `+${growth_rate}` : growth_rate }}</span>
            <span v-else>N/A</span>
          </template>
        </v-data-table>
      </content-block>
    </layout-section>
  </app-layout>
</template>

<script>
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';
  import { EXPERTISE_CONTRIBUTION_TYPE, ASSESSMENT_CRITERIA_TYPE } from '@/variables';
  import { mapGetters } from 'vuex';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import AppLayout from '@/components/layout/components/Layout';
  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';

  export default {
    name: 'Participants',
    components: { LayoutSection, ContentBlock, AppLayout },
    data() {
      return {
        isShowFilter: true,
        isShowBadge: false,
        disciplines: [
          { text: 'All', value: ""},
          ...disciplinesService
            .getTopLevelNodes()
            .map((d) => ({ text: d.label, value: d.id }))
        ],
        contributions: mapSelectListFromEnum(EXPERTISE_CONTRIBUTION_TYPE, { blackList: [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN], allowBlank: true, blankLabel: "All" }),
        criterias: mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, { blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN], allowBlank: true, blankLabel: "All" }),
        defaultFilter: {
          searchTerm: "",
          discipline: "",
          contribution: "",
          criteria: ""
        },
        filter: {
          searchTerm: "",
          discipline: "",
          contribution: "",
          criteria: ""
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
            text: 'Percentile rank',
            value: 'percentile_rank',
            align: 'center',
            width: '15%',
            sort: (a, b) => parseFloat(a) - parseFloat(b)
          },
          {
            text: 'Growth rate',
            value: 'growth_rate',
            align: 'center',
            width: '15%',
            sort: (a, b) => parseFloat(a) - parseFloat(b)
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
      })
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
        this.filter.searchTerm = this.$route.query.name;
      }

      this.isShowBadge = !_.isEqual(this.filter, this.defaultFilter);

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
        })
          .then(() => { this.isShowBadge = !_.isEqual(this.filter, this.defaultFilter); });
      },
      clearFilter() {
        this.filter = _.cloneDeep(this.defaultFilter);
        this.$store.dispatch('participants/loadFilterParticipants', {
          filter: this.filter
        })
          .then(() => { this.isShowBadge = !_.isEqual(this.filter, this.defaultFilter); });
      },
      growthRateIsUp(rate) {
        return parseFloat(rate) >= 0;
      }
    }
  };
</script>
