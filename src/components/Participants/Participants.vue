<template>
  <app-layout v-if="$ready">
    <layout-section>
      <d-block title="Participants">
        <template #titleAddon>
          <d-filter-sidebar
            v-model="filterModel"
            @apply="applyFilter"
            @reset="resetFilter"
          >
            <v-text-field
              v-model="filterModel.searchTerm"
              outlined
              class="mb-4"
              prepend-inner-icon="search"
              hide-details
              label="Search by names"
            />

            <d-filter-term-disciplines v-model="filterModel.discipline" single-choice />
            <d-filter-term-contributions v-model="filterModel.contribution" single-choice />
            <d-filter-term-assessment-criterias v-model="filterModel.criteria" single-choice />
          </d-filter-sidebar>
        </template>
      </d-block>

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
  import { mapGetters } from 'vuex';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import AppLayout from '@/components/layout/components/Layout';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';
  import DFilterTermDisciplines from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermDisciplines';
  import DFilterTermContributions from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermContributions';
  import DFilterTermAssessmentCriterias from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermAssessmentCriterias';

  const defaultFilter = () => ({
    searchTerm: '',
    discipline: '',
    contribution: '',
    criteria: ''
  });

  export default {
    name: 'Participants',
    components: {
      DFilterTermAssessmentCriterias,
      DFilterTermContributions,
      DFilterTermDisciplines,
      DFilterSidebar,
      DBlock,
      LayoutSection,
      ContentBlock,
      AppLayout
    },
    data() {
      return {
        storageFilterModelKey: 'participants__filter',

        filterModel: defaultFilter(),

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
      for (const key of ['discipline', 'contribution', 'criteria', 'searchTerm']) {
        if (this.$route.query[key]) {
          this.filterModel[key] = this.$route.query[key];
        }
      }

      if (this.$ls.get(this.storageFilterModelKey)) {
        this.filterModel = this.$ls.get(this.storageFilterModelKey);
      }

      this.$ls.on(this.storageFilterModelKey, this.updateData, true);
    },

    beforeDestroy() {
      this.$ls.off(this.storageFilterModelKey, this.applyFilter);
    },

    methods: {
      applyFilter() {
        this.$ls.set(this.storageFilterModelKey, this.filterModel);
      },

      resetFilter() {
        this.filterModel = { ...defaultFilter() };

        this.applyFilter();
      },

      updateData() {
        return this.$store.dispatch('participants/loadFilterParticipants', {
          filter: this.$ls.get(this.storageFilterModelKey)
        }).then(() => {
          this.$setReady();
        });
      },

      growthRateIsUp(rate) {
        return parseFloat(rate) >= 0;
      }
    }
  };
</script>
