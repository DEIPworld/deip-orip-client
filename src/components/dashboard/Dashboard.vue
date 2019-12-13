<template>
  <v-container fluid fill-height pa-0 ma-0 class="dashboard-page">

    <v-layout row class="full-width full-height">
      <v-flex xl12 lg12 md12 sm12 xs12>
        <v-tabs color="#fafafa">
          <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>

          <v-tab :class="themeSettings['tabs-text-class']" href="#tab-summary">Summary</v-tab>
          <!-- <v-tab :class="themeSettings['tabs-text-class']" href="#tab-projects">Projects</v-tab>
          <v-tab :class="themeSettings['tabs-text-class']" href="#tab-investments">Investments</v-tab>
          <v-tab :class="themeSettings['tabs-text-class']" href="#tab-reviews">Reviews</v-tab>
          <v-tab :class="themeSettings['tabs-text-class']" href="#tab-experts">Experts</v-tab>
          <v-tab :class="themeSettings['tabs-text-class']" href="#tab-ip-protection">IP protection</v-tab> -->
          <v-spacer></v-spacer>

          <v-tabs-items class="tab-content">
            <v-tab-item value="tab-summary">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap class="full-height">

                    <v-flex xl4 lg4 md4 sm12 xs12 order-xl1 order-lg1 order-md1 order-sm2 order-xs2>
                      <v-layout column fill-height>
                        <v-layout row wrap>
                          <v-flex xl12 lg12 md12 sm12 xs12 class="projects-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Projects <span class="primary--text pl-2">{{researches.length}}</span></div>
                              <div v-if="isResearchCreationAvailable">
                                <v-btn :to="{ name: 'CreateResearch' }" color="primary" small class="ma-0">
                                  Create Project
                                  <v-icon small>add</v-icon>
                                </v-btn>
                              </div>
                            </v-layout>
                            <v-layout column class="research-tiles-container">
                              <research-project-tile row v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in researches" 
                                :key="'research-tile-' + research.id" 
                                :research="research" 
                                :members="authors"
                                :tokenSale="tokenSale" 
                                :tokenSaleContributions="tokenSaleContributions"
                                :group="group"
                                :class="{'pb-5': i != researches.length - 1}">
                              </research-project-tile>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-layout>
                    </v-flex>

                    <v-flex xll8 lg8 md8 sm12 xs12 order-xl2 order-lg2 order-md2 order-sm1 order-xs1>
                      <v-layout column fill-height>
                        <v-layout row wrap>
                          <v-flex xl6 lg6 md6 sm12 xs12 class="investments-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Investments</div>
                              <div></div>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <!-- <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Wallet</span>
                                <span></span>
                              </v-layout> -->
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>My portfolio</span>
                                <span><v-chip class="ma-0" color="#826AF9" text-color="white">{{investments.length}}</v-chip></span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>My deals</span>
                                <span><v-chip class="ma-0" color="#826AF9" text-color="white">2</v-chip></span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Explore investment opportunities</span>
                                <span><v-chip class="ma-0" color="#826AF9" text-color="white">30</v-chip></span>
                              </v-layout>
                            </v-layout>

                            <v-layout column v-if="hasResearchShares">
                              <div class="title bold">Distribution</div>
                              <div class="py-4">
                                <GChart
                                  type="PieChart"
                                  :settings="{ packages: ['corechart'] }"
                                  :data="sharesDistributionChart.data"
                                  :options="sharesDistributionChart.options"
                                />
                              </div>
                            </v-layout>
                          </v-flex>

                          <v-flex xl6 lg6 md6 sm12 xs12 class="reviews-column">
                            <v-layout row justify-space-between class="column-header">
                              <div class="title bold">Reviews</div>
                              <!-- <div>
                                <v-btn color="primary" small outline class="ma-0">
                                  Ask for Review
                                </v-btn>
                              </div> -->
                            </v-layout>

                            <v-layout column class="pb-5">
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>My reviews</span>
                                <span class="primary--text body-2">{{myReviewsCount}}</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Invites</span>
                                <span class="primary--text body-2">{{myInvitesCount}}</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Reviews on my research</span>
                                <span class="primary--text body-2">{{reviewsOnMyResearchCount}}</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span>Reviews on my request</span>
                                <span class="primary--text body-2">{{reviewsOnMyRequestsCount}}</span>
                              </v-layout>
                            </v-layout>

                            <v-layout column class="pb-5">
                              <div class="title bold">Experts <span class="primary--text pl-2">{{experts.length}}</span></div>
                              <div class="pt-2">
                               <user-autocomplete-picker
                                  label="Find an expert"
                                  :users="experts"
                                  :displayLimit="7"
                                  @onSelectUser="selectExpert"
                                />
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
                                    <a href="https://app.deip.co" class="a" style="color: #4e64db;" target="_blank">NDA contracts</a>
                                  </v-layout>
                                </span>
                                <span class="primary--text body-2">0</span>
                              </v-layout>
                              <v-layout row justify-space-between py-1 class="column-text-item">
                                <span class="body-2">
                                  <v-layout row>
                                    <v-icon color="#2962FF" class="pr-2">lock</v-icon>
                                    <a href="https://app.deip.co" class="a" style="color: #4e64db;" target="_blank">IP certificates</a>
                                  </v-layout>
                                </span>
                                <span class="primary--text body-2">0</span>
                              </v-layout>
                            </v-layout>
                          </v-flex>
                        </v-layout>

                        <v-layout v-if="hasResearchShares" row wrap align-end>
                          <v-flex xl12 lg12 md12 sm12 xs12 class="total-assets-row">
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
            <!-- <v-tab-item value="tab-projects">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap>
                    <div>Projects tab</div>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-investments">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap>
                    <div>Investments tab</div>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-reviews">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap>
                    <div>Reviews tab</div>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-experts">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap>
                    <div>Experts tab</div>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-ip-protection">
              <v-layout row fill-height>
                <v-card color="white" class="full-width elevation-0 pt-4 glass-container">
                  <v-layout row wrap>
                    <div>IP-protection tab</div>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item> -->
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import deipRpc from '@deip/deip-oa-rpc-client';
import * as usersService from './../../utils/user';
import moment from 'moment';

export default {
  name: "Dashboard",

  data() {
    return {
      selectedResearchToReview: null,
      isRequestingReview: false,

      blackList: ['regacc', 'initdelegate'],
      isExpertsLoading: false,
      expertsSearch: "",
      selectedExpert: null,
      foundExperts: []
    };
  },
  
  computed: {
    ...mapGetters({
      user: "auth/user",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
      themeSettings: 'layout/themeSettings',
      researches: "dashboard/researches",
      experts: "dashboard/experts",
      currentShares: "dashboard/currentShares",
      investments: "dashboard/investments",
      reviewsOnMyResearchCount: "dashboard/reviewsOnMyResearchCount",
      reviewsOnMyRequestsCount: "dashboard/reviewsOnMyRequestsCount",
      myInvitesCount: "dashboard/myInvitesCount",
      myReviewsCount: "dashboard/myReviewsCount"
    }),

    isResearchCreationAvailable() {
      return this.isProjectManager || this.isPrincipalInvestigator;
    },

    hasResearchShares() {
      return this.currentShares.length;
    },

    isRequestReviewDisabled() {
      return !this.selectedExpert 
        || !this.selectedResearchToReview 
        || !this.selectedExpert.expertiseTokens.some(exp => this.selectedResearchToReview.disciplines.some(d => d.id == exp.discipline_id));
    },

    sharesDistributionChart() {
      let totalShares = this.currentShares.reduce((acc, { share }) => acc + this.convertToPercent(share.amount), 0);
      return {
        data: [
          ['Distribution', ''],
          ...this.currentShares.map(({ research, share }) => [research.title,  this.convertToPercent(share.amount) / totalShares * 100])
          // ['Research title', 10]
        ],

        options: {
          title: "",
          legend: { position: 'left' },
          colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
          chartArea: { 
            left: 0,
            width: "100%",
            height: "100%"
          },
          pieSliceTextStyle: {
            // color: "#ffffff", 
            color: "#000000",
            fontSize: 10
          },
          pieHole: 0.6
        }
      }
    },

    totalAssetsPriceChart() {

      return {
        data: [
         ['Date', ...this.currentShares.map(({ research }) => `Asset ${research.id}`)],
         [moment().day(-10).toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 10))],
         [moment().day(-9).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 9)) ],
         [moment().day(-8).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 8)) ],
         [moment().day(-7).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 7)) ],
         [moment().day(-6).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 6)) ],
         [moment().day(-5).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 5)) ],
         [moment().day(-4).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 4)) ],
         [moment().day(-3).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 3)) ],
         [moment().day(-2).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 2)) ],
         [moment().day(-1).toDate(),  ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 1)) ],
         [moment().toDate(),          ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 0)) ]
         // [new Date('11/01/19'),  1000,      400,       700      ],
        ],

        options: {
          title: "",
          legend: { position: 'top' },
          hAxis: { title: '', format: 'MMM d, y' },
          vAxis: { title: '', minValue: 0 },
          colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
          chartArea: {
            left: this.$vuetify.breakpoint.smAndUp ? "5%" : "10%",
            width: this.$vuetify.breakpoint.smAndUp ? "95%" : "90%",
            height: "80%"
          }
        }
      }
    },

  },

  methods: {
    selectExpert(expert) {
      this.selectedExpert = expert;
    },

    queryExperts() {
      this.isExpertsLoading = true;
      this.foundExperts = this.expertsSearch ? this.experts.filter(user => {
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

    requestReview(review) {
      this.isRequestingReview = true;
      deipRpc.broadcast.requestReviewAsync(
        this.user.privKey,
        this.selectedResearchToReview.id,
        [this.selectedExpert.account.name],
        this.user.username
      )
      .then(() => {
        this.$store.dispatch('layout/setSuccess', { message: "Proposal was successfully created"});
        this.selectedExpert = null;
        this.selectedResearchToReview = null;
      }, (err) => { alert(`The "${this.selectedResearchToReview.title}" research does not have an Announcement, please add it before requesting a review`); })
      .finally(() => {
        this.isRequestingReview = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>

@import "./../../styles/colors.less";

.tab-content {
  border-top: 1px solid @grey-lighten-2;
}

.column-header {
  min-height: 55px;
}

.column-text-item {
  min-height: 30px;
  text-decoration: none;
  
  a {
    text-decoration: none;
    color: #000000;
  }

  a:hover {
    text-decoration: underline;
  }
  
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

@media (min-width: 0px) and (max-width: 960px) {
  .projects-column {
    padding-top: 10%;
    // padding-bottom: 5%;
  }
}

@media (min-width: 960px) {
  .projects-column {
    padding-right: 5%;
    overflow: scroll;
  }
  .research-tiles-container {
    height: 100vh;
  }
}

@media (min-width: 0px) and (max-width: 960px) {
  .investments-column {
    // padding-top: 10%;
  }
}

@media (min-width: 960px) {
  .investments-column {
    padding-left: 5%;
    padding-right: 5%;
    border-left: 1px solid @grey-lighten-2;
    border-right: 1px solid @grey-lighten-2;
  }
}

@media (min-width: 0px) and (max-width: 960px) {
  .reviews-column {
    // padding-top: 10%;
  }
}

@media (min-width: 960px) {
  .reviews-column {
    padding-left: 5%;
    padding-right: 5%;
  }
}

@media (min-width: 0px) and (max-width: 960px) {
  .total-assets-row {
    // padding-top: 5%;
  }
}

@media (min-width: 960px) {
  .total-assets-row {
    padding-top: 5%;
    padding-right: 5%;
  }
}

</style>
