<!-- TODO: need full rework -->
<template>
  <div class="pa-5">
    <v-tabs v-model="activeTab">
      <v-tab href="#tab-summary">
        Summary
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="activeTab">
      <v-tab-item value="tab-summary">
        <v-row>
          <v-col
            md="4"
            cols="12"
            order-md="1"
            order="2"
          >
            <v-row justify="space-between" class="column-header">
              <v-col class="text-h6 bold">
                Projects
                <span class="primary--text pl-2">{{ researches.length }}</span>
              </v-col>
              <v-col>
                <v-btn
                  :to=" { name: 'project.create' }"
                  color="primary"
                  small
                  class="ma-0"
                >
                  Create Project
                  <v-icon small>
                    add
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <research-project-tile
              v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in researches"
              :key="'research-tile-' + research.id"
              row
              :research="research"
              :members="authors"
              :token-sale="tokenSale"
              :token-sale-contributions="tokenSaleContributions"
              :group="group"
              :class="{'pb-5': i != researches.length - 1}"
            />
          </v-col>

          <v-col
            md="8"
            cols="12"
            order-md="2"
            order="1"
          >
            <v-row>
              <v-col
                xl="6"
                lg="6"
                md="6"
                sm="12"
                class="investments-column xs"
              >
                <v-row justify="space-between" class="column-header">
                  <div class="text-h6 bold">
                    Investments
                  </div>
                  <div />
                </v-row>

                <div class="pb-12">
                  <!-- <v-row justify="space-between" py-1 class="column-text-item">
                    <span>Wallet</span>
                    <span></span>
                  </v-row> -->
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>My portfolio</v-col>
                    <v-col>
                      <v-chip
                        class="ma-0"
                        color="#826AF9"
                        text-color="white"
                      >
                        {{ investments.length }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>My deals</v-col>
                    <v-col>
                      <v-chip class="ma-0" color="#826AF9" text-color="white">
                        2
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>Explore investment opportunities</v-col>
                    <v-col>
                      <v-chip class="ma-0" color="#826AF9" text-color="white">
                        30
                      </v-chip>
                    </v-col>
                  </v-row>
                </div>

                <v-row v-if="hasResearchShares" column>
                  <v-col class="text-h6 bold">
                    Distribution
                  </v-col>
                  <v-col class="py-6">
                    <GChart
                      type="PieChart"
                      :settings="{ packages: ['corechart'] }"
                      :data="sharesDistributionChart.data"
                      :options="sharesDistributionChart.options"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                xl="6"
                lg="6"
                md="6"
                sm="12"
                class="reviews-column xs"
              >
                <v-row justify="space-between" class="column-header">
                  <v-col class="text-h6 bold">
                    Reviews
                  </v-col>
                  <!-- <div>
                    <v-btn color="primary" small outlined class="ma-0">
                      Ask for Review
                    </v-btn>
                  </div> -->
                </v-row>

                <v-row column class="pb-12">
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>My reviews</v-col>
                    <v-col class="primary--text text-body-2">
                      {{ myReviewsCount }}
                    </v-col>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>Invites</v-col>
                    <v-col class="primary--text text-body-2">
                      {{ myInvitesCount }}
                    </v-col>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>Reviews on my research</v-col>
                    <v-col class="primary--text text-body-2">
                      {{ reviewsOnMyResearchCount }}
                    </v-col>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <v-col>Reviews on my request</v-col>
                    <v-col class="primary--text text-body-2">
                      {{ reviewsOnMyRequestsCount }}
                    </v-col>
                  </v-row>
                </v-row>

                <v-row column class="pb-12">
                  <div class="text-h6 bold">
                    Experts <span class="primary--text pl-2">{{ experts.length }}</span>
                  </div>
                  <div class="pt-2">
                    <user-autocomplete-picker
                      label="Find an expert"
                      :users="experts"
                      :display-limit="5"
                      @onSelectUser="selectExpert"
                    />
                  </div>
                </v-row>

                <v-row column class="pb-12">
                  <v-row justify="space-between" class="column-header">
                    <div class="text-h6 bold">
                      Protect IP
                    </div>
                    <div />
                  </v-row>

                  <v-row justify="space-between" class="column-text-item py-1">
                    <span class="text-body-2">
                      <v-row>
                        <v-icon color="#2962FF" class="pr-2">visibility</v-icon>
                        <a
                          href="https://app.deip.co"
                          class="a"
                          style="color: #4e64db;"
                          target="_blank"
                        >NDA contracts</a>
                      </v-row>
                    </span>
                    <span class="primary--text text-body-2">0</span>
                  </v-row>
                  <v-row justify="space-between" class="column-text-item py-1">
                    <span class="text-body-2">
                      <v-row>
                        <v-icon color="#2962FF" class="pr-2">lock</v-icon>
                        <a
                          href="https://app.deip.co"
                          class="a"
                          style="color: #4e64db;"
                          target="_blank"
                        >IP certificates</a>
                      </v-row>
                    </span>
                    <span class="primary--text text-body-2">0</span>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-if="hasResearchShares" align="end">
              <v-col
                xl="12"
                lg="12"
                md="12"
                sm="12"
                class="total-assets-row xs"
              >
                <div class="text-h6 bold">
                  Total assets value
                </div>
                <div class="pt-6">
                  <GChart
                    type="AreaChart"
                    :settings="{ packages: ['corechart'] }"
                    :data="totalAssetsPriceChart.data"
                    :options="totalAssetsPriceChart.options"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <!-- <v-tab-item value="tab-projects">
        <v-row fill-height>
          <v-card color="white" class="full-width elevation-0 pt-6 glass-container">
            <v-row>
              <div>Projects tab</div>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-investments">
        <v-row fill-height>
          <v-card color="white" class="full-width elevation-0 pt-6 glass-container">
            <v-row>
              <div>Investments tab</div>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-reviews">
        <v-row fill-height>
          <v-card color="white" class="full-width elevation-0 pt-6 glass-container">
            <v-row>
              <div>Reviews tab</div>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-experts">
        <v-row fill-height>
          <v-card color="white" class="full-width elevation-0 pt-6 glass-container">
            <v-row>
              <div>Experts tab</div>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-ip-protection">
        <v-row fill-height>
          <v-card color="white" class="full-width elevation-0 pt-6 glass-container">
            <v-row>
              <div>IP-protection tab</div>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>

<script>
  import moment from 'moment';
  import { mapGetters } from 'vuex';

  export default {
    name: 'Dashboard',

    data() {
      return {
        activeTab: 'tab-summary',

        selectedResearchToReview: null,
        isRequestingReview: false,

        blackList: [...this.SYSTEM_USERS],
        isExpertsLoading: false,
        expertsSearch: '',
        selectedExpert: null,
        foundExperts: []
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        tenant: 'auth/tenant',
        themeSettings: 'layout/themeSettings',
        researches: 'dashboard/researches',
        experts: 'dashboard/experts',
        currentShares: 'dashboard/currentShares',
        investments: 'dashboard/investments',
        reviewsOnMyResearchCount: 'dashboard/reviewsOnMyResearchCount',
        reviewsOnMyRequestsCount: 'dashboard/reviewsOnMyRequestsCount',
        myInvitesCount: 'dashboard/myInvitesCount',
        myReviewsCount: 'dashboard/myReviewsCount'
      }),

      hasResearchShares() {
        return this.currentShares.length;
      },

      isRequestReviewDisabled() {
        return !this.selectedExpert
          || !this.selectedResearchToReview
          || !this.selectedExpert.expertiseTokens.some((exp) => this.selectedResearchToReview.disciplines.some((d) => d.id == exp.discipline_id));
      },

      sharesDistributionChart() {
        const totalShares = this.currentShares.reduce((acc, { share }) => acc + this.convertToPercent(share.amount), 0);
        return {
          data: [
            ['Distribution', ''],
            ...this.currentShares.map(({ research, share }) => [research.title, this.convertToPercent(share.amount) / totalShares * 100])
            // ['Project title', 10]
          ],

          options: {
            title: '',
            legend: { position: 'left' },
            colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
            chartArea: {
              left: 0,
              width: '100%',
              height: '100%'
            },
            pieSliceTextStyle: {
              // color: "#ffffff",
              color: '#000000',
              fontSize: 10
            },
            pieHole: 0.6
          }
        };
      },

      totalAssetsPriceChart() {
        return {
          data: [
            ['Date', ...this.currentShares.map(({ research }) => `Asset ${research.id}`)],
            [moment()
              .day(-10)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 10))],
            [moment()
              .day(-9)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 9))],
            [moment()
              .day(-8)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 8))],
            [moment()
              .day(-7)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 7))],
            [moment()
              .day(-6)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 6))],
            [moment()
              .day(-5)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 5))],
            [moment()
              .day(-4)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 4))],
            [moment()
              .day(-3)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 3))],
            [moment()
              .day(-2)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 2))],
            [moment()
              .day(-1)
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 1))],
            [moment()
              .toDate(), ...this.currentShares.map((s, i) => this.mockPreviousTokenPrice(s, 0))]
            // [new Date('11/01/19'),  1000,      400,       700      ],
          ],

          options: {
            title: '',
            legend: { position: 'top' },
            hAxis: {
              title: '',
              format: 'MMM d, y'
            },
            vAxis: {
              title: '',
              minValue: 0
            },
            colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
            chartArea: {
              left: this.$vuetify.breakpoint.smAndUp ? '5%' : '10%',
              width: this.$vuetify.breakpoint.smAndUp ? '95%' : '90%',
              height: '80%'
            }
          }
        };
      }

    },

    methods: {
      selectExpert(expert) {
        this.selectedExpert = expert;
      },

      queryExperts() {
        this.isExpertsLoading = true;
        this.foundExperts = this.expertsSearch ? this.experts.filter((user) => {
          const name = this.$options.filters.fullname(user);
          return name.toLowerCase()
            .indexOf((this.expertsSearch || '').toLowerCase()) > -1
            || user.account.name.toLowerCase()
              .indexOf((this.expertsSearch || '').toLowerCase()) > -1;
        })
          .map(((user) => {
            const name = this.$options.filters.fullname(user);
            return {
              name,
              user
            };
          })) : [];

        if (!this.expertsSearch) {
          this.selectedExpert = null;
        }

        this.isExpertsLoading = false;
      },

      requestReview(review) {}
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
