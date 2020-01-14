<template>
  <v-layout class="pa-5" row wrap>
    <v-flex xs12 sm12 md12 lg8 xl8>
      <v-layout column>
        <div>How my data is used by others</div>
        <div>Number of citations: 7</div>
        <div ref="graphContainer" style="height: 500px">
          <references-dependency-graph :data="references" :width="graphWidth" :height="graphHeight"></references-dependency-graph>
        </div>

        <v-layout row>
          <v-flex xs6 sm6 md6 lg6 xl6>
            <v-layout column>
              <div>Who used my data</div>
              <div>Graph</div>
            </v-layout>
          </v-flex>

          <v-flex xs6 sm6 md6 lg6 xl6>
            <v-layout column>
              <div>Where my data is used</div>
              <div>Graph</div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-flex>

    <v-flex xs12 sm12 md12 lg4 xl4>
      <v-layout column>sidebar</v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import references from './references-graph-data.json';

export default {
  name: "ResearchContentReferences",
  data() {
    return {
      references: null,
      graphWidth: 0,
      graphHeight: 0
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      contentRef: 'rcd/contentRef'
    }),
  },
  methods: {
  },
  mounted() {
    let graphContainer = this.$refs["graphContainer"];
    this.graphWidth = graphContainer.clientWidth;
    this.graphHeight = graphContainer.clientHeight;
    this.references = references;
  }
};
</script>

<style lang="less" scoped>

</style>
