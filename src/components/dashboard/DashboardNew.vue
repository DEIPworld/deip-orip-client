<template>
  <v-container fluid fill-height pa-0 pb-5 ma-0 class="dashboard-page">
    <v-layout row class="full-width full-height">
      <v-flex xl12 lg12 md12 sm12 xs12>
        <v-tabs color="secondary lighten-2">
          <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>

          <v-tab
            :class="themeSettings['tabs-text-class']"
            href="#tab-my-projects"
          >My projects: {{ myResearches.length }}
          </v-tab>
          <v-tab
            :class="themeSettings['tabs-text-class']"
            href="#tab-following-projects"
          >Following projects: {{ followingResearches.length }}
          </v-tab>
          <v-spacer></v-spacer>

          <v-tabs-items class="tab-content">
            <v-tab-item value="tab-my-projects">
              <v-card color="white" class="full-width full-height elevation-0 pt-4 glass-container">
                <div class="column-header" v-if="myResearches.length">
                  <v-btn
                    :to="{ name: 'CreateResearch' }"
                    color="primary"
                    small
                    class="ma-0 px-5 py-3"
                  >Start a project
                  </v-btn>
                </div>
                <v-layout row wrap v-if="myResearches.length">
                  <v-flex
                    xs12
                    sm6
                    md4
                    lg4
                    xl4
                    px-2
                    py-4
                    my-1
                    v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in myResearches"
                    :key="'research-tile-' + research.id"
                  >
                    <research-project-tile
                      row
                      :research="research"
                      :members="authors"
                      :tokenSale="tokenSale"
                      :tokenSaleContributions="tokenSaleContributions"
                      :group="group"
                      :class="{'pb-5': i != myResearches.length - 1}"
                    ></research-project-tile>
                  </v-flex>
                </v-layout>
                <v-layout v-else justify-center mt-4 pt-4>
                  <v-flex shrink>
                    <v-layout row wrap class="display-flex">
                      <v-flex mr-5>
                        <img width="64px" src="/assets/img/create-project.png" />
                      </v-flex>
                      <v-flex>
                        <div
                          class="subheading font-weight-bold mb-2"
                        >You haven’t created any project yet
                        </div>
                        <div class="body-2 mb-4">Upload a project and collaborate for future success</div>
                        <div>
                          <v-btn
                            :to="{ name: 'CreateResearch' }"
                            color="primary"
                            class="px-5 ma-0"
                          >Create your first project
                          </v-btn>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-following-projects">
              <v-layout row fill-height>
                <v-card color="white" class="full-width full-height elevation-0 pt-4 glass-container">
                  <v-layout row wrap v-if="followingResearches.length">
                    <v-flex
                      xs12
                      sm6
                      md4
                      lg4
                      xl4
                      px-2
                      py-4
                      my-1
                      v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in followingResearches"
                      :key="'research-tile-' + research.id"
                    >
                      <research-project-tile
                        row
                        :research="research"
                        :members="authors"
                        :tokenSale="tokenSale"
                        :tokenSaleContributions="tokenSaleContributions"
                        :group="group"
                        :class="{'pb-5': i != followingResearches.length - 1}"
                      ></research-project-tile>
                    </v-flex>
                  </v-layout>
                  <v-layout v-else justify-center mt-4 pt-4>
                    <v-flex shrink>
                      <v-layout row wrap class="display-flex">
                        <v-flex mr-5>
                          <img width="64px" src="/assets/img/follow-project.png" />
                        </v-flex>
                        <v-flex>
                          <div
                            class="subheading font-weight-bold mb-2"
                          >You’re not following any project yet
                          </div>
                          <div
                            class="body-2 mb-4"
                          >We have a lot of incredible projects on our platform. Take a look
                          </div>
                          <div>
                            <v-btn
                              :to="{ name: 'ResearchFeed' }"
                              color="primary"
                              class="px-5 ma-0"
                            >Browse projects
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';

  export default {
    name: 'Dashboard',

    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        themeSettings: 'layout/themeSettings',
        researches: 'dashboard/myMembershipAndBookmarkedResearches'
      }),

      myResearches() {
        return this.researches.reduce(
          (arr, research) =>
            research.research.is_following === false ? [ ...arr, research ] : arr,
          []
        );
      },

      followingResearches() {
        return this.researches.reduce(
          (arr, research) =>
            research.research.is_following === true ? [ ...arr, research ] : arr,
          []
        );
      }
    },

    methods: {},
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

  .glass-container {
    padding-left: 5%;
    padding-right: 5%;
  }
</style>
