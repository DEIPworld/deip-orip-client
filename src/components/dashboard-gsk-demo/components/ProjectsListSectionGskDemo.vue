<template>
  <v-layout column fill-height>
    <v-layout row wrap>
      <v-flex xl12 lg12 md12 sm12 xs12 class="projects-column">
        <v-layout row justify-space-between align-baseline class="column-header pb-5">
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
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "DashboardGskDemoProjectsList",
  props: {

  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
      researches: "dashboard_gsk_demo/researches",
    }),
    isResearchCreationAvailable() {
      return this.isProjectManager || this.isPrincipalInvestigator;
    }
  },

  methods: {

  },

  data() {
    return {

    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
