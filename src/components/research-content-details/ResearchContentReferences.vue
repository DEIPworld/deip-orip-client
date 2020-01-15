<template>

<base-page-layout>
  <v-card slot="content">
    <v-layout class="pa-5" row wrap>
      <v-flex xs12 sm12 md12 lg8 xl8>
        <v-layout column>
          <div class="title">How my data is used by others</div>
          <div class="py-4 subheading half-bold">Number of citations: {{referencesCount}}</div>
          <div ref="graphContainer" style="height: 400px">
            <references-dependency-graph :data="researchContentReferencesGraph" :width="graphWidth" :height="graphHeight"></references-dependency-graph>
          </div>

          <v-layout row class="pt-5">
            <v-flex xs6 sm6 md6 lg6 xl6>
              <v-layout column class="outer-references-by-org">
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
              <v-layout column class="outer-references-by-content-type">
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
        <div class="pl-4">
          <v-tabs color="#ffffff">
            <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>
            <v-tab :class="themeSettings['tabs-text-class']" href="#tab-file">
              <span class="subheading capitalize">File Info</span>
            </v-tab>

            <v-tabs-items class="tab-content">
              <v-tab-item value="tab-file">
                <v-layout column>
                  <v-layout class="pt-3" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="body-2">Title:</span>
                    </v-flex>
                    <v-flex xs8>
                      <router-link class="a"
                        :to="{
                          name: 'ResearchContentDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(researchGroup.permlink),
                            research_permlink: encodeURIComponent(research.permlink),
                            content_permlink: encodeURIComponent(researchContent.permlink)
                          }
                        }"
                      >{{ researchContent.title }}</router-link>
                    </v-flex>
                  </v-layout>

                  <v-layout class="py-3" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="body-2">Data Type:</span>
                    </v-flex>
                    <v-flex xs8>
                      <span>{{getContentType(researchContent.content_type).text}}</span>
                    </v-flex>
                  </v-layout>
                  
                  <v-layout class="py-3" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="body-2">Authors:</span>
                    </v-flex>
                    <v-flex xs8>
                      <v-layout align-baseline>
                          <div v-for="(author, i) in researchContentAuthorsList" :key="`author-${i}`">
                            <platform-avatar 
                              :user="author"
                              :size="20"
                              link-to-profile
                              link-to-profile-class="px-1"
                            ></platform-avatar>
                          </div>
                      </v-layout>
                    </v-flex>
                  </v-layout>

                  <v-layout class="py-3" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="body-2">Organization:</span>
                    </v-flex>
                    <v-flex xs8>
                      <v-layout align-baseline>
                        <img width="20px" height="20px" class="align-self-center" :src="`/static/research_groups/${researchGroup.permlink}-mini.png`" />
                        <span class="pl-2">{{researchGroup.name}}</span>
                      </v-layout>
                    </v-flex>
                  </v-layout>

                  <v-layout class="py-3" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="body-2">Release date:</span>
                    </v-flex>
                    <v-flex xs8>
                      <v-layout align-baseline>
                        <v-icon small class="align-self-center">event</v-icon>
                        <span class="pl-2">{{moment(researchContent.created_at).format("d MMM YYYY")}}</span>
                      </v-layout>
                    </v-flex>
                  </v-layout>

                  <v-divider class="my-4"></v-divider>

                  <v-layout v-if="outerReferences.length" row justify-space-between align-baseline>
                    <v-flex xs4>
                      <span class="subheading">Referenced by:</span>
                    </v-flex>
                    <v-flex xs8>
                      <div v-for="(ref, i) in outerReferences" :key="`out-ref-${i}`">
                        <router-link class="a"
                          :to="{
                            name: 'ResearchContentDetails',
                            params: {
                              research_group_permlink: encodeURIComponent(ref.researchGroup.permlink),
                              research_permlink: encodeURIComponent(ref.research.permlink),
                              content_permlink: encodeURIComponent(ref.researchContent.permlink)
                            }
                          }"
                        >{{ ref.researchContent.title }}</router-link>
                      </div>
                    </v-flex>
                  </v-layout>

                </v-layout>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</base-page-layout>

</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import { getContentType } from './../../services/ResearchService'

export default {
  name: "ResearchContentReferences",
  data() {
    return {
      graphWidth: 0,
      graphHeight: 0
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      researchContent: 'rcd/content',
      research: 'rcd/research',
      researchGroup: 'rcd/group',
      contentRef: 'rcd/contentRef',
      researchContentReferencesGraph: 'rcd/researchContentReferencesGraph',      
      researchGroupMembers: 'rcd/membersList',
      themeSettings: 'layout/themeSettings'
    }),
    referencesCount() {
      return this.researchContentReferencesGraph.nodes.length;
    },
    outerReferences() {
      return this.researchContentReferencesGraph.nodes.filter((node) => node.class === "out");
    },
    researchContentAuthorsList() {
      return this.researchContent ? this.researchGroupMembers.filter(m => this.researchContent.authors.some(a => a === m.account.name)) : [];
    },
    researchContentAuthorsList() {
      return this.researchContent ? this.researchGroupMembers.filter(m => this.researchContent.authors.some(a => a === m.account.name)) : [];
    },

    outerReferencesByContentTypeChart() {
      let outerReferencesByContentType = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
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

      let totalInnerReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.class === "out").length;

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
      let outerReferencesByOrg = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
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

      let totalOuterReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.class === "out").length;
      
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
    getContentType
  },
  mounted() {
    let graphContainer = this.$refs["graphContainer"];
    this.graphWidth = graphContainer.clientWidth;
    this.graphHeight = graphContainer.clientHeight;
  }
};
</script>

<style lang="less" scoped>

.outer-references-by-org {
  border-right: 1px solid #efefef; 
  padding: 0px 20px 0px 0px;
}

.outer-references-by-content-type {
  border-left: 1px solid #efefef; 
  padding: 0px 0px 0px 20px;
}

</style>
