<template>

<base-page-layout>
  <v-card slot="content">
    <v-layout class="pa-5" row wrap>
      <v-flex xs12 sm12 md12 lg8 xl8>
        <v-layout column>
          <div class="title">How my data is used by others</div>
          <div class="py-4 subheading half-bold">Number of citations: {{referencesCount}}</div>
          <div ref="graphContainer" style="height: 400px">
            <references-dependency-graph :data="referencesModel" :width="graphWidth" :height="graphHeight"></references-dependency-graph>
          </div>

          <v-layout row class="pt-5">
            <v-flex xs6 sm6 md6 lg6 xl6>
              <v-layout column>
                <div class="title">Who used my data</div>
                <div class="py-5">
                  <GChart
                    type="PieChart"
                    :settings="{ packages: ['corechart'] }"
                    :data="outerReferencesByOrgChart.data"
                    :options="outerReferencesByOrgChart.options"
                  />
                </div>
              </v-layout>
            </v-flex>

            <v-flex xs6 sm6 md6 lg6 xl6>
              <v-layout column>
                <div class="title">Where my data is used</div>
                <div class="py-5">
                  <GChart
                    type="PieChart"
                    :settings="{ packages: ['corechart'] }"
                    :data="outerReferencesByContentTypeChart.data"
                    :options="outerReferencesByContentTypeChart.options"
                  />
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm12 md12 lg4 xl4>
        <v-layout column>sidebar</v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</base-page-layout>

</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import referencesObj from './references-graph-data.json';

export default {
  name: "ResearchContentReferences",
  data() {
    return {
      referencesModel: referencesObj,
      graphWidth: 0,
      graphHeight: 0
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      contentRef: 'rcd/contentRef'
    }),
    referencesCount() {
      console.log(this.referencesModel)
      return this.referencesModel ? this.referencesModel.nodes.length : 0;
    },

    outerReferencesByContentTypeChart() {

      let outerReferencesByContentType = this.referencesModel.nodes.reduce((acc, node) => {
        let { contentType } = node;
        if (node.class === "out") {
          let item = acc[contentType]
          if (!item) {
            acc[contentType] = { contentType, count: 1 };
          } else {
            item.count += 1;
          }
        }
        return acc;
      }, {});

      let totalInnerReferencesCount = this.referencesModel.nodes.filter((node) => node.class === "out").length;

      return {
        data: [
          ['Distribution', ''],
          ...Object.values(outerReferencesByContentType).map(({ contentType, count} ) => [contentType, count / totalInnerReferencesCount * 100])
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

    outerReferencesByOrgChart() {
      
      let outerReferencesByOrg = this.referencesModel.nodes.reduce((acc, node) => {
        let { org } = node;
        if (node.class === "out") {
          let item = acc[org]
          if (!item) {
            acc[org] = { org, orgName: node.orgName, count: 1 };
          } else {
            item.count += 1;
          }
        }
        return acc;
      }, {});

      let totalOuterReferencesCount = this.referencesModel.nodes.filter((node) => node.class === "out").length;
      
      return {
        data: [
          ['Distribution', ''],
          ...Object.values(outerReferencesByOrg).map(({ orgName, count }) => [orgName, count / totalOuterReferencesCount * 100])
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
    }

  },
  methods: {
  },
  mounted() {
    let graphContainer = this.$refs["graphContainer"];
    this.graphWidth = graphContainer.clientWidth;
    this.graphHeight = graphContainer.clientHeight;
  }
};
</script>

<style lang="less" scoped>

</style>
