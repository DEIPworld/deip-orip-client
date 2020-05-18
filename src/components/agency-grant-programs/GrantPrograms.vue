<template>
  <base-page-layout>
    <template #toolbar>
      <div class="w-100">
        <v-breadcrumbs class="px-0 body-2" divider="/" :items="breadcrumbs" />
        <v-divider />
      </div>
    </template>

    <v-card class="elevation-0">
      <v-card-text class="px-0">
        <v-row no-gutters>
          <v-col cols="3" class="text-center">
            <v-avatar size="160px">
              <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.external_id, 320, 320, true)">
            </v-avatar>
          </v-col>
          <v-col cols="9">
            <div v-if="selectedArea">
              <div class="primary--text body-2">
                PROGRAMS
              </div>
              <div class="headline c-mt-2">
                {{ selectedArea.title }}
              </div>
              <div class="body-1 c-mt-2">
                {{ selectedArea.subAreaTitle }}
              </div>
            </div>
            <div v-else>
              <div class="headline c-mt-2">
                {{ organizationProfile.name }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
    </v-card>

    <v-row no-gutters class="pb-6">
      <v-col cols="3">
        <v-card class="full-height elevation-0">
          <div class="subtitle-1 pa-6 bold">
            Research Areas
          </div>
          <v-expansion-panels flat class="elevation-0" :value="selectedAreas">
            <v-expansion-panel v-for="(area,i) in organizationProfile.researchAreas" :key="i">
              <v-expansion-panel-header>
                <b>{{ area.title }}</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card flat>
                  <v-card-text class="pa-0">
                    <div
                      v-for="(subArea, i) in area.subAreas"
                      :key="`${i}-subArea`"
                      class="sub-area-list-item"
                      :class="isSelectedSubArea(subArea) ? 'active' : ''"
                      @click="selectArea(area, subArea)"
                    >
                      <div class="sub-area-list-item-content">
                        {{ subArea.title }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card class="py-4 full-height elevation-0">
          <v-row no-gutters class="px-2">
            <v-col class="grow">
              <div class="display-flex justify-space-around align-center">
                <div class="sort-option">
                  <span class="body-1 grey--text">SORT BY</span>
                </div>
                <div class="sort-option" @click="setSortCriteria('postedDate')">
                  <span class="body-2">New</span>
                  <v-icon class="sort-icon">
                    {{ getSortIcon('postedDate') }}
                  </v-icon>
                </div>
                <div class="sort-option" @click="setSortCriteria('closingDate')">
                  <span class="body-2">End Date</span>
                  <v-icon class="sort-icon">
                    {{ getSortIcon('closingDate') }}
                  </v-icon>
                </div>
                <div class="sort-option" @click="setSortCriteria('title')">
                  <span class="body-2">A-Z Title</span>
                  <v-icon class="sort-icon">
                    {{ getSortIcon('title') }}
                  </v-icon>
                </div>
                <div class="sort-option" @click="setSortCriteria('award')">
                  <span class="body-2">Award</span>
                  <v-icon class="sort-icon">
                    {{ getSortIcon('award') }}
                  </v-icon>
                </div>
              </div>
            </v-col>
            <v-col class="shrink">
              <div style="min-width: 300px;" class="px-4">
                <v-text-field
                  v-model="filter.searchTerm"
                  append-icon="search"
                  class="pa-0 ma-0"
                  name="search-term"
                />
              </div>
            </v-col>
            <v-col v-if="selectedArea" cols="12">
              <div class="subtitle-1 bold c-pl-5 c-pb-5 c-pt-2">
                {{ selectedArea.subAreaTitle }}: Core Programs
              </div>
              <template v-for="(program, i) in filteredCorePrograms">
                <program-list-item
                  :key="`${i}-core-program`"
                  :is-first="i == 0"
                  :program="program"
                />
              </template>
              <div v-show="!filteredCorePrograms.length" class="caption c-pl-5">
                No core programs found for specified criteria
              </div>
            </v-col>
            <v-col v-if="selectedArea" cols="12" class="c-pt-10">
              <div class="subtitle-1 bold c-pl-5 c-pb-5 c-pt-2">
                Additional Funding Opportunities for the
                {{ selectedArea.abbreviation }}
              </div>
              <template v-for="(program, i) in filteredAdditionalPrograms">
                <program-list-item
                  :key="`${i}-additional-program`"
                  :is-first="i == 0"
                  :program="program"
                />
              </template>
              <div v-show="!filteredAdditionalPrograms.length" class="caption c-pl-5">
                No additional programs found for specified criteria
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AgencyGrantPrograms',

    data() {
      return {
        filter: {
          searchTerm: '',
          sortCriteria: {
            key: 'title',
            order: 1
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        organizationProfile: 'agencyGrantPrograms/organization',
        selectedArea: 'agencyGrantPrograms/selectedArea',

        corePrograms: 'agencyGrantPrograms/corePrograms',
        additionalPrograms: 'agencyGrantPrograms/additionalPrograms'
      }),
      breadcrumbs() {
        return [
          {
            text: this.organizationProfile.name,
            disabled: false,
            href: `/#/${this.organizationProfile.permlink}/group-details`
          },
          {
            text: 'Programs',
            disabled: false
          }
          // { text: this.selectedArea.abbreviation, disabled: true },
          // { text: this.selectedArea.subAreaAbbreviation, disabled: true }
        ];
      },
      filteredCorePrograms() {
        return this.filterPrograms(this.corePrograms);
      },
      filteredAdditionalPrograms() {
        return this.filterPrograms(this.additionalPrograms);
      },
      selectedAreas() {
        return this.organizationProfile.researchAreas.map((area) => (area.title == this.selectedArea.title ? 1 : 0));
      }
    },

    methods: {
      getSortIcon(key) {
        if (this.filter.sortCriteria.key == key) {
          return this.filter.sortCriteria.order == 1 ? 'arrow_drop_up' : 'arrow_drop_down';
        }
        return '';
      },

      selectArea(area, subArea) {
        this.$store.dispatch('agencyGrantPrograms/setResearchArea', {
          area,
          subArea
        });
      },

      setSortCriteria(key) {
        const sorting = this.filter.sortCriteria;
        if (!sorting || sorting.key != key) {
          this.filter.sortCriteria = {
            key,
            order: 1
          };
        } else if (sorting.key == key) {
          if (sorting.order == 1) {
            sorting.order = -1;
          } else {
            sorting.order = 1;
          }
        }
      },

      isSelectedSubArea(subArea) {
        return subArea.title == this.selectedArea.subAreaTitle;
      },

      filterPrograms(collection) {
        let filtered = collection.filter((p) => {
          if (!this.filter.searchTerm) {
            return true;
          }
          return p.additional_info.funding_opportunity_title.toLowerCase()
            .includes(this.filter.searchTerm.toLowerCase());
        });

        filtered = filtered.filter((p) => p.target_disciplines.some((d) => this.selectedArea.disciplines.includes(d)));

        const { filter } = this;
        filtered.sort((a, b) => {
          if (a[filter.key] < b[filter.key]) { return -1; }
          if (a[filter.key] > b[filter.key]) { return 1; }
          return 0;
        });

        return this.filter.sortCriteria.order == 1 ? filtered : filtered.reverse();
      }
    }
  };
</script>

<style lang="less" scoped>

  .sub-area-list-item {
    cursor: pointer;
  }

  .sub-area-list-item:hover {
    background: #f1f8fe;
  }

  .sub-area-list-item.active {
    background: #f1f8fe;
  }

  .sub-area-list-item-content {
    padding-left: 20%;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-right: 5%;
    min-height: 45px;
  }

  .sort-option {
    cursor: pointer;
  }

  .sort-icon {
    min-width: 24px;
    min-height: 24px;
  }

</style>
