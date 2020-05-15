<template>
  <app-layout>
    <layout-toolbar>
      <v-tabs
        v-model="activeTab"
        :color="themeSettings['tabs-text-class']"
      >
        <v-tab key="my-projects">
          My projects: {{ myResearches.length }}
        </v-tab>
        <v-tab key="following-projects">
          Following projects: {{ followingResearches.length }}
        </v-tab>
      </v-tabs>
    </layout-toolbar>
    <layout-section>
      <v-tabs-items v-model="activeTab">
        <v-tab-item key="my-projects">
          <div v-if="myResearches.length" class="mb-12">
            <v-btn
              :to="{ name: 'CreateResearch' }"
              color="primary"
            >
              Start a project
            </v-btn>
          </div>

          <v-row v-if="myResearches.length" class="ma-n3">
            <v-col
              v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in myResearches"
              :key="'research-tile-' + research.id"
              cols="12"
              sm="6"
              md="4"
            >
              <research-project-tile
                row
                :research="research"
                :members="authors"
                :token-sale="tokenSale"
                :token-sale-contributions="tokenSaleContributions"
                :group="group"
              />
            </v-col>
          </v-row>

          <v-row v-else justify="center">
            <v-col cols="auto" class="text-center">
              <img width="64px" class="mb-3" src="/assets/img/create-project.png">
              <div class="headline mb-3">
                You haven’t created any project yet
              </div>
              <div class="body-1 mb-12">
                Upload a project and collaborate for future success
              </div>
              <div>
                <v-btn
                  :to="{ name: 'CreateResearch' }"
                  color="primary"
                >
                  Create your first project
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item key="following-projects">
          <v-row v-if="followingResearches.length" class="ma-n3">
            <v-col
              v-for="({research, authors, tokenSale, tokenSaleContributions, group }, i) in followingResearches"
              :key="'research-tile-' + research.id"
              cols="12"
              sm="6"
              md="4"
            >
              <research-project-tile
                row
                :research="research"
                :members="authors"
                :token-sale="tokenSale"
                :token-sale-contributions="tokenSaleContributions"
                :group="group"
              />
            </v-col>
          </v-row>

          <v-row v-else justify="center">
            <v-col cols="auto" class="text-center">
              <img width="64px" class="mb-3" src="/assets/img/follow-project.png">
              <div class="headline mb-3">
                You’re not following any project yet
              </div>
              <div class="body-1 mb-12">
                We have a lot of incredible projects on our platform. Take a look
              </div>
              <div>
                <v-btn
                  :to="{ name: 'ResearchFeed' }"
                  color="primary"
                >
                  Browse projects
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </layout-section>
  </app-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutToolbar from '@/components/layout/components/LayoutToolbar';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'Dashboard',
    components: { LayoutSection, LayoutToolbar, AppLayout },
    data() {
      return {
        activeTab: null
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        themeSettings: 'layout/themeSettings',
        researches: 'dashboard/myMembershipAndBookmarkedResearches'
      }),

      myResearches() {
        return this.researches.reduce(
          (arr, research) => (research.research.is_following === false ? [...arr, research] : arr),
          []
        );
      },

      followingResearches() {
        return this.researches.reduce(
          (arr, research) => (research.research.is_following === true ? [...arr, research] : arr),
          []
        );
      }
    },

    methods: {}
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
