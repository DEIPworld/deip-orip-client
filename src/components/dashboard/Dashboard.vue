<template>
  <v-container fluid fill-height pa-0 ma-0 class="dashboard-page">

    <v-layout row class="full-width full-height">
      <v-flex xl12 lg12 md12 sm12 xs12>
        <v-tabs color="#fafafa">
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab href="#tab-summary">Summary</v-tab>
          <v-tab href="#tab-projects">Projects</v-tab>
          <v-tab href="#tab-investments">Investments</v-tab>
          <v-tab href="#tab-reviews">Reviews</v-tab>
          <v-tab href="#tab-experts">Experts</v-tab>
          <v-tab href="#tab-ip-protection">IP protection</v-tab>
          <v-spacer></v-spacer>

          <v-tabs-items>
            <v-tab-item value="tab-summary">
              <v-layout row>
                <v-card color="white" class="elevation-0 pt-4 glass-container">
                  <v-layout row wrap>

                    <v-flex lx4 lg4 md4 sm12 xs12>
                      <v-layout column fill-height>
                        <v-layout row wrap>
                          <v-flex xl12 lg12 md12 sm12 xs12 class="projects-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Projects <span class="primary--text pl-2">8</span></div>
                              <div>
                                <v-btn color="primary" small class="ma-0">
                                  Create Project
                                  <v-icon small>add</v-icon>
                                </v-btn>
                              </div>
                            </v-layout>
                            <v-layout column class="research-tiles-container">
                              <v-layout row v-for="i in [0, 1, 2]" :key="'research-tile-' + i" :class="{'pb-5': i != [0, 1, 2].length - 1}">
                                <research-project-tile :research="{id: i}"></research-project-tile>
                              </v-layout>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-layout>
                    </v-flex>

                    <v-flex lxl8 lg8 md8 sm12 xs12>
                      <v-layout column fill-height>
                        <v-layout row wrap>
                          <v-flex lxl6 lg6 md6 sm12 xs12 class="investments-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Investments</div>
                              <div></div>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Wallet</span>
                                <span></span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Portfolio</span>
                                <span></span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>My deals</span>
                                <span><v-chip class="ma-0" color="#826AF9" text-color="white">3</v-chip></span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Explore investment opportunities</span>
                                <span><v-chip class="ma-0" color="#826AF9" text-color="white">12</v-chip></span>
                              </v-layout>
                            </v-layout>

                            <v-layout column>
                              <div class="title bold">Distribution</div>
                              <div class="py-4">
                                <GChart
                                  type="PieChart"
                                  :settings="{ packages: ['corechart'] }"
                                  :data="distributionChart.data"
                                  :options="distributionChart.options"
                                />
                              </div>
                            </v-layout>
                          </v-flex>

                          <v-flex xl6 lg6 md6 sm12 xs12 class="reviews-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Reviews</div>
                              <div>
                                <v-btn color="primary" small outline class="ma-0">
                                  Ask for Review
                                </v-btn>
                              </div>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>My Reviews</span>
                                <span class="primary--text body-2">10</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Invites</span>
                                <span class="primary--text body-2">3</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Reviews on my research</span>
                                <span class="primary--text body-2">0</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Reviews on my request</span>
                                <span class="primary--text body-2">0</span>
                              </v-layout>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <div class="title bold">Experts <span class="primary--text pl-2">34</span></div>
                              <div class="pt-2">
                                <v-autocomplete
                                  label="Expert name"
                                  autocomplete
                                  :append-icon="null"
                                  :loading="isExpertsLoading"
                                  :items="foundExperts"
                                  item-text="name"
                                  item-value="user"
                                  :search-input.sync="expertsSearch"
                                  v-on:keyup="queryExperts()"
                                  v-model="selectedExpert"
                                  @input="onSetExpert()"
                                ></v-autocomplete>
                              </div>
                              <div v-if="!selectedExpert">
                                <platform-avatar :size="40" v-for="(expert, i) in allUsers.slice(0, 8)" :key="'expert-' + i" :user="expert" class="expert-avatar pr-1" ></platform-avatar>
                              </div>
                              <div v-else>
                                <platform-avatar :user="selectedExpert" :size="40" link-to-profile link-to-profile-class="pl-3"></platform-avatar>
                                <div class="py-1 body-2">{{selectedExpert | employmentOrEducation}}</div>
                              </div>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <v-layout row justify-space-between class="column-header">
                                <div class="title bold">Protect IP</div>
                                <div></div>
                              </v-layout>

                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span class="body-2">
                                  <v-layout row>
                                    <v-icon color="#2962FF" class="pr-2">visibility</v-icon>
                                    <span style="color: #4e64db">NDA contracts</span>
                                  </v-layout>
                                </span>
                                <span class="primary--text body-2">10</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span class="body-2">
                                  <v-layout row>
                                    <v-icon color="#2962FF" class="pr-2">lock</v-icon>
                                    <span style="color: #4e64db">IP certificates</span>
                                  </v-layout>
                                </span>
                                <span class="primary--text body-2">3</span>
                              </v-layout>
                            </v-layout>
                          </v-flex>
                        </v-layout>

                        <v-layout row wrap align-end>
                          <v-flex lx12 lg12 md12 sm12 xs12 class="total-assets-column">
                            <div class="title bold">Total assets value</div>
                            <div class="pt-4">
                              <GChart
                                type="AreaChart"
                                :settings="{ packages: ['corechart'] }"
                                :data="totalAssetsPriceChart.data"
                                :options="totalAssetsPriceChart.options"
                              />
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-layout>

                    </v-flex>

                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-projects">
              Projects content
            </v-tab-item>
            <v-tab-item value="tab-investments">
              Investments content
            </v-tab-item>
            <v-tab-item value="tab-reviews">
              Reviews content
            </v-tab-item>
            <v-tab-item value="tab-experts">
              Experts content
            </v-tab-item>
            <v-tab-item value="tab-ip-protection">
              IP-protection content
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-rpc-client';
import * as usersService from './../../utils/user';

export default {
  name: "Dashboard",
  
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    distributionChart() {
      return {
        data: [
          ['Distribution', ''],
          ['Research 1', 11],
          ['Research 2', 2],
          ['Research 3', 2],
          ['Research 4', 2],
          ['Research 5', 7]
        ],

        options: {
          title: "",
          legend: { position: 'left' },
          colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#826af9', '#2d99ff', '#f3f5f8'],
          chartArea: { 
            left: 0, 
            width: "100%",
            height: "100%"
          },
          pieSliceTextStyle: {
            color: "#ffffff", 
            fontSize: 10
          },
          pieHole: 0.6
        }
      }
    },

    totalAssetsPriceChart() {

      return {
        data: [
          ['Date',                'Asset 1', 'Asset 2', 'Asset 3'],
          [new Date('11/01/19'),  1000,      400,       700      ],
          [new Date('11/02/19'),  1170,      460,       300      ],
          [new Date('11/03/19'),  660,       1120,      500      ],
          [new Date('11/04/19'),  1030,      540,       1200     ],
          [new Date('11/05/19'),  550,       300,       600      ],
          [new Date('11/06/19'),  1000,      1500,      480      ],
          [new Date('11/07/19'),  1110,      1600,      790      ],
          [new Date('11/08/19'),  2000,      1700,      1300     ],
          [new Date('11/09/19'),  2100,      1800,      1400     ],
          [new Date('11/10/19'),  2200,      1900,      1500     ],
          [new Date('11/11/19'),  2300,      2000,      1600     ]
        ],

        options: {
          title: "",
          legend: { position: 'top' },
          hAxis: { title: '', format: 'MMM d, y' },
          vAxis: { title: '', minValue: 0,  },
        
          colors: ['#c6bbff', '#f9c3d7', '#a6dcff'],
          chartArea: { 
            left: "5%", 
            width: "95%",
            height: "80%"
          }
        }
      }
    },

  },
  data() {
    return {
      allUsers: [],
      blackList: ['regacc'],
      isExpertsLoading: false,
      expertsSearch: "",
      selectedExpert: null,
      foundExperts: []
    };
  },

  methods: {

    queryExperts() {
      this.isExpertsLoading = true;
      this.foundExperts = this.expertsSearch ? this.allUsers.filter(user => {
        let name = this.$options.filters.fullname(user);
        return name.toLowerCase().indexOf((this.expertsSearch || '').toLowerCase()) > -1 
          || user.account.name.toLowerCase().indexOf((this.expertsSearch || '').toLowerCase()) > -1;
      })
      .map((user => {
        const name = this.$options.filters.fullname(user);
        return { name, user };
      })) : [];

      if (!this.expertsSearch) {
        this.selectedExpert = null;
      }

      this.isExpertsLoading = false;
    },

    onSetExpert() {
      console.log(this.selectedExpert);
    }
  },

  created() {
    this.blackList.push(this.user.account.name);
    deipRpc.api.getAllAccountsAsync()
      .then((accounts) => {
        return usersService.getEnrichedProfiles(
          accounts
            .filter(acc => !this.blackList.some(a => a == acc.name))
            .map(a => a.name));
      })
      .then((users) => {
        this.allUsers = users;
      });
  }
};
</script>

<style lang="less" scoped>

@import "./../../styles/colors.less";

.column-header {
  min-height: 55px;
}

.column-text-item {
  min-height: 30px;
  
  .v-chip {  
    height: 20px;
  }
}

.expert-avatar {
  float: left
}

.glass-container {
  padding-left: 5%;
  padding-right: 5%;
}

.projects-column {
  // padding-left: 2%;
  padding-right: 1%;
  overflow: scroll;
}

.research-tiles-container {
  height: 100vh;
}

.investments-column {
  padding-left: 1%;
  padding-right: 1%;
  border-left: 1px solid @grey-lighten-2;
  border-right: 1px solid @grey-lighten-2;
}

.reviews-column {
  padding-left: 1%;
  // padding-right: 2%;
}

.total-assets-column {
  padding-left: 1%;
  // padding-right: 2%;
}

</style>
