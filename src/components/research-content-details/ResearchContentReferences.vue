<template>
  <layout-section>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="text-h6">
          Data usage overview
        </div>
        <div class="py-6 text-subtitle-1 font-weight-medium">
          Number of reference nodes: {{ referencesCount }}
        </div>
        <div ref="graphContainer" style="height: 400px">
          <references-dependency-graph
            v-if="isMounted"
            :data="researchContentReferencesGraph"
            :width="graphWidth"
            :height="graphHeight"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <div class="pl-6 full-width full-height tabs-container">
          <v-tabs v-model="activeTab">
            <v-tabs-slider />
            <v-tab href="#tab-file">
              <span class="text-subtitle-1 capitalize">File Info</span>
            </v-tab>
            <v-tab href="#tab-references">
              <span class="text-subtitle-1 capitalize">Data users <span v-if="outerReferences.length">({{ outerReferences.length }})</span></span>
            </v-tab>

            <v-tabs-items v-model="activeTab" class="tab-content overflow-x-hidden">
              <v-tab-item value="tab-file">
                <!-- <v-row column class="pt-4"> -->
                <div>
                  <v-row justify="space-between" align="center">
                    <v-col cols="4">
                      <span class="text-body-2">Title:</span>
                    </v-col>
                    <v-col cols="8">
                      <router-link
                        class="a"
                        :to="{
                          name: 'ResearchContentDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(researchGroup.permlink),
                            research_permlink: encodeURIComponent(research.permlink),
                            content_permlink: encodeURIComponent(researchContent.permlink)
                          }
                        }"
                      >
                        {{ researchContent.title }}
                      </router-link>
                    </v-col>
                  </v-row>

                  <v-row
                    class="py-4"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="4">
                      <span class="text-body-2">Data Type:</span>
                    </v-col>
                    <v-col cols="8">
                      <span>{{ getResearchContentType(researchContent.content_type).text }}</span>
                    </v-col>
                  </v-row>

                  <v-row
                    class="py-4"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="4">
                      <span class="text-body-2">Authors:</span>
                    </v-col>
                    <v-col cols="8">
                      <v-row align="center" no-gutters>
                        <div v-for="(author, i) in researchContentAuthorsList" :key="`author-${i}`">
                          <platform-avatar
                            :user="author"
                            :size="20"
                            link-to-profile
                            link-to-profile-class="px-1"
                          />
                        </div>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row
                    class="py-4"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="4">
                      <span class="text-body-2">Organization:</span>
                    </v-col>
                    <v-col cols="8">
                      <v-row no-gutters>
                        <v-col cols="auto">
                          <img
                            width="20px"
                            height="20px"
                            class="align-self-center"
                            :src="$options.filters.researchGroupLogoSrc(researchGroup.external_id, 50, 50, true)"
                          >
                        </v-col>
                        <v-col>
                          <span class="pl-2">{{ researchGroup.name }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row
                    class="py-4"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="4">
                      <span class="text-body-2">Release date:</span>
                    </v-col>
                    <v-col cols="8">
                      <v-row align="center">
                        <v-icon small class="align-self-center">
                          event
                        </v-icon>
                        <span class="pl-2">{{ moment(researchContent.created_at).format('D MMM YYYY') }}</span>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row
                    v-if="contentReviewsList.length"
                    class="py-4"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="4">
                      <span class="text-body-2">Verified by:</span>
                    </v-col>
                    <v-col cols="8">
                      <div
                        v-for="(review, i) in contentReviewsList"
                        :key="`file-verifier-${i}`"
                        class="d-flex justify-space-between"
                        :class="{'py-2': i != 0}"
                      >
                        <platform-avatar
                          :user="review.author"
                          :size="20"
                          link-to-profile
                          link-to-profile-class="px-1"
                        />

                        <v-tooltip class="align-self-center" style="cursor: default" left>
                          <template v-slot:activator="{ on }">
                            <v-icon color="green" v-on="on">
                              check_circle_outline
                            </v-icon>
                          </template>
                          <span>Digital Signature: {{ mockSignature(review.id) }}</span>
                        </v-tooltip>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- </v-row> -->
                </div>
              </v-tab-item>

              <v-tab-item value="tab-references">
                <v-row
                  v-if="hasOuterReferences"
                  class="pt-4"
                  justify="space-between"
                  align="center"
                >
                  <v-col cols="12">
                    <div v-for="(ref, i) in outerReferences" :key="`out-ref-${i}`" class="py-1">
                      <span class="text-body-2 pr-2">{{ i + 1 }}. </span>
                      <router-link
                        class="a"
                        :to="{
                          name: 'ResearchContentDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(ref.researchGroup.permlink),
                            research_permlink: encodeURIComponent(ref.research.permlink),
                            content_permlink: encodeURIComponent(ref.researchContent.permlink)
                          }
                        }"
                      >
                        {{ ref.researchContent.title }}
                      </router-link>
                    </div>
                  </v-col>
                </v-row>
                <v-row
                  v-else
                  class="px-4"
                  align="center"
                >
                  <div class="py-6">
                    Shared material is not by anyone yet
                  </div>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-col>
    </v-row>

    <v-row class="pt-12">
      <v-col
        v-if="hasOuterReferences"
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <v-row column class="outer-references-by-org px-4">
          <div class="text-h6">
            Usage by organization
          </div>
          <div class="py-12">
            <d-chart-pie
              :data="outerReferencesByOrgChart.data"
              donut
              :options="{
                legend: { position: 'left' }
              }"
            />
          </div>
        </v-row>
      </v-col>

      <v-col
        v-if="hasOuterReferences"
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <v-row column class="outer-references-by-content-type px-4">
          <div class="text-h6">
            Usage by data type
          </div>
          <div class="py-12">
            <d-chart-pie
              :data="outerReferencesByContentTypeChart.data"
              donut
              :options="{
                legend: { position: 'left' }
              }"
            />
          </div>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <v-row column class="outer-references-by-discipline px-4">
          <div class="text-h6">
            Usage by domain
          </div>
          <div class="py-12">
            <d-chart-pie
              :data="referencesByDisciplinesChart.data"
              donut
              :options="{
                legend: { position: 'left' }
              }"
            />
          </div>
        </v-row>
      </v-col>
    </v-row>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';

  import crypto from '@deip/lib-crypto';

  import { ResearchService } from '@deip/research-service';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import DChartPie from '@/components/Deipify/DChart/DChartPie';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentReferences',
    components: { LayoutSection, DChartPie },
    data() {
      return {
        activeTab: 'tab-file',
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
        return this.researchContent ? this.researchGroupMembers.filter((m) => this.researchContent.authors.some((a) => a === m.account.name)) : [];
      },

      referencesByDisciplinesChart() {
        const referencesByDiscipline = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
          const { disciplines } = node.research;
          for (let i = 0; i < disciplines.length; i++) {
            const { name } = disciplines[i];
            const item = acc[name];
            if (!item) {
              acc[name] = {
                text: name,
                count: 1
              };
            } else {
              item.count += 1;
            }
          }
          return acc;
        }, {});

        const totalDisciplinesCount = Object.keys(referencesByDiscipline).length;

        return {
          data: [
            ['Distribution', ''],
            ...Object.values(referencesByDiscipline)
              .map(({ text, count }) => [text, count / totalDisciplinesCount * 100])
          ]
        };
      },

      outerReferencesByContentTypeChart() {
        const outerReferencesByContentType = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
          const { contentType: { text } } = node;
          if (node.isOuter) {
            const item = acc[text];
            if (!item) {
              acc[text] = {
                text,
                count: 1
              };
            } else {
              item.count += 1;
            }
          }
          return acc;
        }, {});

        const totalInnerReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.isOuter).length;

        return {
          data: [
            ['Distribution', ''],
            ...Object.values(outerReferencesByContentType)
              .map(({ text, count }) => [text, count / totalInnerReferencesCount * 100])
          ]
        };
      },

      outerReferencesByOrgChart() {
        const outerReferencesByOrg = this.researchContentReferencesGraph.nodes.reduce((acc, node) => {
          const { researchGroup: { permlink: org } } = node;
          if (node.isOuter) {
            const item = acc[org];
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

        const totalOuterReferencesCount = this.researchContentReferencesGraph.nodes.filter((node) => node.isOuter).length;

        return {
          data: [
            ['Distribution', ''],
            ...Object.values(outerReferencesByOrg)
              .map(({ text, count }) => [text, count / totalOuterReferencesCount * 100])
          ],

          options: {
            title: '',
            legend: { position: 'left' },
            colors: ['#80DEEA', '#80CBC4', '#A5D6A7', '#B9F6CA', '#CE93D8', '#B39DDB'],
            chartArea: {
              left: 0,
              width: '80%',
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
      }
    },
    mounted() {
      const { graphContainer } = this.$refs;
      this.graphWidth = graphContainer.clientWidth;
      this.graphHeight = graphContainer.clientHeight;
      this.isMounted = true;
    },

    methods: {
      mockSignature(id) {
        return crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(`${id}`).buffer));
      },
      getResearchContentType(type) { return researchService.getResearchContentType(type); }
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
    // overflow-y: scroll;
  }

</style>
