<template>
  <v-container fluid fill-height class="ma-0 pa-0 full-height">
    <v-card class="full-height elevation-0">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="elevation-0">
            <v-card-text class="px-0 pa-0">
              <v-breadcrumbs divider="/" :items="breadcrumbs"></v-breadcrumbs>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card class="elevation-0">
            <v-divider></v-divider>
            <v-card-text class="px-0">
              <v-layout row wrap>
                <v-flex xs3 text-xs-center>
                  <v-avatar size="160px">
                    <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.id, 320, 320, true)">
                  </v-avatar>
                </v-flex>
                <v-flex xs9>
                  <div v-if="selectedArea">
                    <div class="primary--text body-2">PROGRAMS</div>
                    <div class="headline c-mt-2">{{selectedArea.title}}</div>
                    <div class="body-1 c-mt-2">{{selectedArea.subAreaTitle}}</div>
                  </div>
                  <div v-else>
                    <div class="headline c-mt-2">{{organizationProfile.name}}</div>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
          </v-card>
        </v-flex>

        <v-flex xs12>
          <v-layout row wrap class="pb-4">
            <v-flex xs3>
              <v-card class="full-height elevation-0">
                <div class="subheading pa-4 bold">Research Areas</div>
                <v-expansion-panel class="elevation-0" :value="selectedAreas">
                  <v-expansion-panel-content v-for="(area,i) in organizationProfile.researchAreas" :key="i">
                    <div slot="header"><b>{{area.title}}</b></div>
                    <v-card>
                      <v-card-text class="pa-0">
                        <div class="sub-area-list-item"
                            :class="isSelectedSubArea(subArea) ? 'active' : ''"
                            v-for="(subArea, i) in area.subAreas" 
                            :key="`${i}-subArea`"
                            @click="selectArea(area, subArea)">
                          <div class="sub-area-list-item-content">{{subArea.title}}</div>
                        </div>  
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-flex>
            <v-flex xs9>
              <v-card class="py-3 full-height elevation-0">
                <v-layout row wrap class="px-2">
                  <v-flex grow>
                    <v-layout row justify-space-around align-center>
                      <div class="sort-option">
                        <span class="body-1 grey--text">SORT BY</span>
                      </div>
                      <div class="sort-option" @click="setSortCriteria('postedDate')">
                        <span class="body-2">New</span>
                        <v-icon class="sort-icon">
                          {{getSortIcon('postedDate')}}
                        </v-icon>
                      </div>
                      <div class="sort-option" @click="setSortCriteria('closingDate')">
                        <span class="body-2">End Date</span>
                        <v-icon class="sort-icon">
                          {{getSortIcon('closingDate')}}
                        </v-icon>
                      </div>
                      <div class="sort-option" @click="setSortCriteria('title')">
                        <span class="body-2">A-Z Title</span>
                        <v-icon class="sort-icon">
                          {{getSortIcon('title')}}
                        </v-icon>
                      </div>
                      <div class="sort-option" @click="setSortCriteria('award')">
                        <span class="body-2">Award</span>
                        <v-icon class="sort-icon">
                          {{getSortIcon('award')}}
                        </v-icon>
                      </div>
                    </v-layout>
                  </v-flex>
                  <v-flex shrink>
                    <v-layout row>
                      <div style="min-width: 300px">
                        <v-text-field 
                          append-icon="search"
                          class="pa-0 ma-0"
                          name="search-term"
                          v-model="filter.searchTerm">
                        </v-text-field> 
                      </div>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="selectedArea">
                    <div class="subheading bold c-pl-5 c-pb-5 c-pt-2">{{selectedArea.subAreaTitle}}: Core Programs</div>
                    <template v-for="(program, i) in filteredCorePrograms">
                      <program-list-item :is-first="i == 0" :program="program" :key="`${i}-core-program`"></program-list-item>
                    </template>
                    <div v-show="!filteredCorePrograms.length" class="caption c-pl-5">
                      No core programs found for specified criteria
                    </div>
                  </v-flex>
                  <v-flex xs12 v-if="selectedArea" class="c-pt-10">
                    <div class="subheading bold c-pl-5 c-pb-5 c-pt-2">Additional Funding Opportunities for the {{selectedArea.abbreviation}}</div>
                    <template v-for="(program, i) in filteredAdditionalPrograms">
                      <program-list-item :is-first="i == 0" :program="program" :key="`${i}-additional-program`"></program-list-item>
                    </template>
                    <div v-show="!filteredAdditionalPrograms.length" class="caption c-pl-5">
                      No additional programs found for specified criteria
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "AgencyPrograms",

        data() {
            return {
                filter: {
                  searchTerm: "",
                  sortCriteria: { key: "title", order: 1 },
                }
            }
        },

        computed: {
            ...mapGetters({
                organizationProfile: 'organizationPrograms/organization',
                selectedArea: 'organizationPrograms/selectedArea',

                corePrograms: 'organizationPrograms/corePrograms',
                additionalPrograms: 'organizationPrograms/additionalPrograms'
            }),
            breadcrumbs(){
              return [ 
                { text: this.organizationProfile.shortName, disabled: false }, 
                { text: "Programs", disabled: false },
                { text: this.selectedArea.abbreviation, disabled: false }, 
                { text: this.selectedArea.subAreaAbbreviation, disabled: false }
              ];
            },
            filteredCorePrograms() {
              return this.filterPrograms(this.corePrograms);

            },
            filteredAdditionalPrograms() {
              return this.filterPrograms(this.additionalPrograms);
            },
            selectedAreas() {
              return this.organizationProfile.researchAreas.map(area => area.title == this.selectedArea.title ? 1 : 0);
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
            this.$store.dispatch('organizationPrograms/setResearchArea', { area, subArea });
          },
          
          setSortCriteria(key) {
            let sorting = this.filter.sortCriteria;
            if (!sorting || sorting.key != key) {
              this.filter.sortCriteria = { key: key, order: 1 }
            } else if (sorting.key == key) {
               if (sorting.order == 1) {
                  sorting.order = -1
               } else {
                  sorting.order = 1;
               }
            }
          },

          isSelectedSubArea(subArea) {
            return subArea.title == this.selectedArea.subAreaTitle;
          },

          filterPrograms(collection) {
            let filtered = collection.filter(p => {
              if (!this.filter.searchTerm) {
                return true;
              }
              return p.additional_info.funding_opportunity_title.toLowerCase().includes(this.filter.searchTerm.toLowerCase());
            });

            filtered = filtered.filter(p => {
              return p.target_disciplines.some(d => this.selectedArea.disciplines.includes(d));
            });

            let filter = this.filter;
            filtered.sort(function(a, b) {
              if(a[filter.key] < b[filter.key]) { return -1; }
              if(a[filter.key] > b[filter.key]) { return 1; }
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
