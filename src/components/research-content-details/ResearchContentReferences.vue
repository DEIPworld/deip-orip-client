<template>

<base-page-layout>
  <v-card slot="content">
    <v-layout class="pa-5" row wrap>
      <v-flex xs12 sm12 md12 lg12 xl12>

        <v-layout row wrap class="pt-5">

          <v-flex xs12 sm12 md8 lg8 xl8>
            <v-layout class="full-width" column>
              <div class="title">Data usage overview</div>
              <div class="py-4 subheading half-bold">Number of reference nodes: {{referencesCount}}</div>
              <div ref="graphContainer" style="height: 400px">
                <references-dependency-graph v-if="isMounted" :data="researchContentReferencesGraph" :width="graphWidth" :height="graphHeight"></references-dependency-graph>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 sm12 md4 lg4 xl4>
            <div class="pl-4 full-width full-height tabs-container">
              <v-tabs color="#ffffff">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#tab-file">
                  <span class="subheading capitalize">File Info</span>
                </v-tab>
                <v-tab href="#tab-references">
                  <span class="subheading capitalize">References <span v-if="outerReferences.length">({{outerReferences.length}})</span></span>
                </v-tab>

                <v-tabs-items class="tab-content">
                  <v-tab-item value="tab-file">
                    <v-layout column class="pt-3">
                      <v-layout row justify-space-between align-baseline>
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
                            <img width="20px" height="20px" class="align-self-center" :src="$options.filters.researchGroupLogoSrc(researchGroup.id, 50, 50, true)" />
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
                            <span class="pl-2">{{moment(researchContent.created_at).format("D MMM YYYY")}}</span>
                          </v-layout>
                        </v-flex>
                      </v-layout>

                      <v-layout v-if="contentReviewsList.length" class="py-3" row justify-space-between align-baseline>
                        <v-flex xs4>
                          <span class="body-2">Verified by:</span>
                        </v-flex>
                        <v-flex xs8>
                          <v-layout align-baseline row justify-space-between v-for="(review, i) in contentReviewsList" :key="`file-verifier-${i}`" :class="{'py-2': i != 0}">
                            <platform-avatar 
                              :user="review.author"
                              :size="20"
                              link-to-profile
                              link-to-profile-class="px-1"
                            ></platform-avatar>

                            <v-tooltip class="align-self-center" style="cursor: default" left>
                              <v-icon color="green" slot="activator">check_circle_outline</v-icon>
                              <span>Digital Signature: {{mockSignature(review.id)}}</span>
                            </v-tooltip>
                          </v-layout>
                        </v-flex>
                      </v-layout>

                    </v-layout>
                  </v-tab-item>

                  <v-tab-item value="tab-references">
                    <v-layout v-if="hasOuterReferences" class="pt-3" row justify-space-between align-baseline>
                      <v-flex xs12>
                        <div v-for="(ref, i) in outerReferences" class="py-1" :key="`out-ref-${i}`">
                          <span class="body-2 pr-2">{{i + 1}}. </span>
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
                    <v-layout v-else row wrap align-baseline align-center px-3>
                      <div class="py-4">
                        There are no references to this material
                      </div>
                    </v-layout>
                  </v-tab-item>

                </v-tabs-items>
              </v-tabs>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-layout row wrap class="pt-5">

          <v-flex v-if="hasOuterReferences" xs12 sm12 md4 lg4 xl4>
            <v-layout column class="outer-references-by-org px-3">
              <div class="title">Usage by organization</div>
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

          <v-flex v-if="hasOuterReferences" xs12 sm12 md4 lg4 xl4>
            <v-layout column class="outer-references-by-content-type px-3">
              <div class="title">Usage by data type</div>
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

          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-layout column class="outer-references-by-discipline px-3">
              <div class="title">Usage by discipline</div>
              <div class="py-5">
                <GChart
                  type="PieChart"
                  :settings="{ packages: ['corechart'] }"
                  :data="referencesByDisciplinesChart.data"
                  :options="referencesByDisciplinesChart.options"
                />
              </div>
            </v-layout>
          </v-flex>

        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</base-page-layout>

</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import { getContentType } from './../../services/ResearchService'
import crypto from '@deip/lib-crypto'

export default {
  name: "ResearchContentReferences",
  data() {
    return {
      graphWidth: 0,
      graphHeight: 0,
      isMounted: false
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
      contentReviewsList: 'rcd/contentReviewsList'
    }),
    referencesCount() {
      return this.researchContentReferencesGraph.nodes.length;
    },
    outerReferences() {
      return this.researchContentReferencesGraph.nodes.filter((node) => node.isOuter);
    },
    hasOuterReferences() {
      return this.outerReferences.length != 0;
    },
    researchContentAuthorsList() {
      return this.researchContent ? this.researchGroupMembers.filter(m => this.researchContent.authors.some(a => a === m.account.name)) : [];
    },

    referencesByDisciplinesChart() {
      let referencesByDiscipline = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
        let disciplines = node.research.disciplines;
        for (let i = 0; i < disciplines.length; i++) {
          let { name } = disciplines[i];
          let item = acc[name]
          if (!item) {
            acc[name] = { text: name, count: 1 }
          } else {
            item.count += 1;
          }
        }
        return acc;
      }, {})

      let totalDisciplinesCount = Object.keys(referencesByDiscipline).length;

      return {
        data: [
          ['Distribution', ''],
          ...Object.values(referencesByDiscipline).map(({ text, count} ) => [text, count / totalDisciplinesCount * 100])
        ],

        options: {
          title: "",
          legend: { position: 'left' },
          colors: [ '#C62828', '#AD1457', '#6A1B9A','#37474F', '#283593', '#4E342E' ],
          chartArea: { 
            left: 0,
            width: "80%",
            height: "100%"
          },
          pieSliceTextStyle: {
            color: "#000000",
            fontSize: 10
          },
          pieHole: 0.6
        }
      }
    },

    outerReferencesByContentTypeChart() {
      let outerReferencesByContentType = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
        let { contentType: { text } } = node;
        if (node.isOuter) {
          let item = acc[text]
          if (!item) {
            acc[text] = { text, count: 1 };
          } else {
            item.count += 1;
          }
        }
        return acc;
      }, {});

      let totalInnerReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.isOuter).length;

      return {
        data: [
          ['Distribution', ''],
          ...Object.values(outerReferencesByContentType).map(({ text, count } ) => [text, count / totalInnerReferencesCount * 100])
        ],

        options: {
          title: "",
          legend: { position: 'left' },
          colors: [ '#FFAB91', '#FFCC80', '#FFE082','#F48FB1', '#E6EE9C', '#EF9A9A' ],
          chartArea: { 
            left: 0,
            width: "80%",
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
        let { "researchGroup": { "permlink": org } } = node;
        if (node.isOuter) {
          let item = acc[org]
          if (!item) {
            acc[org] = { 
              org: node.researchGroup.permlink, 
              text: node.researchGroup.name, 
              count: 1 
            };
          } else {
            item.count += 1;
          }
        }
        return acc;
      }, {});

      let totalOuterReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.isOuter).length;
      
      return {
        data: [
          ['Distribution', ''],
          ...Object.values(outerReferencesByOrg).map(({ text, count }) => [text, count / totalOuterReferencesCount * 100])
        ],

        options: {
          title: "",
          legend: { position: 'left' },
          colors: ['#80DEEA', '#80CBC4', '#A5D6A7', '#B9F6CA', '#CE93D8', '#B39DDB'],          
          chartArea: { 
            left: 0,
            width: "80%",
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
    getContentType,
    mockSignature(id) {
      return crypto.hexify(crypto.sha256(new TextEncoder("utf-8").encode("" + id).buffer));
    }
  },
  mounted() {
    let graphContainer = this.$refs["graphContainer"];
    this.graphWidth = graphContainer.clientWidth;
    this.graphHeight = graphContainer.clientHeight;
    this.isMounted = true;
  }
};
</script>

<style lang="less" scoped>

.outer-references-by-org {
  border-right: 1px solid #efefef; 
}

.outer-references-by-content-type {
  border-left: 1px solid #efefef; 
  border-right: 1px solid #efefef; 
}

.outer-references-by-discipline {
  border-left: 1px solid #efefef; 
}

.tabs-container {
  height: 500px; 
  overflow: scroll;
}

</style>
