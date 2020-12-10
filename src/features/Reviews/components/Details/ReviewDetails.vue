<template>
  <div>
    <d-layout>
      <d-layout-section class="fill-height">
        <d-layout-section-main>
          <d-stack gap="32">
            <d-stack gap="4">
              <div class="text-overline text--secondary">
                project
              </div>
              <div>
                <router-link
                  :to="{
                    name: 'project.details',
                    params: {
                      researchtExternalId: project.externalId
                    }
                  }"
                  class="link text--primary text-decoration-none"
                >
                  {{ project.title }}
                  <v-icon>
                    mdi-arrow-top-right-thin-circle-outline
                  </v-icon>
                </router-link>
              </div>
            </d-stack>

            <d-stack gap="4">
              <div class="text-overline text--secondary">
                Subject
              </div>
              <div class="text-h3">
                Review on
                {{ getResearchContentType(content.contentType).text }}:
                <router-link
                  :to="{
                    name: 'project.content.details',
                    params: {
                      researchtExternalId: project.externalId,
                      contentExternalId: content.externalId
                    }
                  }"
                  class="link text--primary"
                >
                  {{ content.title }}
                </router-link>
              </div>
            </d-stack>

            <d-block>
              <template #title>
                <div class="text-overline text--secondary">
                  Author
                </div>
                <users-list
                  :users="review.author"
                  view-type="brief"
                  avatar-size="80"
                >
                  <template #item-info="{ user, hasLocation }">
                    <div v-if="user.profile" class="pt-1 text-body-2">
                      <d-stack v-if="hasLocation(user.profile)" horizontal gap="9">
                        <v-icon small>
                          mdi-map-marker
                        </v-icon>
                        <div>{{ user | userLocation }}</div>
                      </d-stack>
                      <d-stack horizontal gap="9">
                        <v-icon small>
                          mdi-school
                        </v-icon>
                        <div>{{ user | employmentOrEducation }}</div>
                      </d-stack>
                    </div>
                  </template>
                </users-list>
              </template>
            </d-block>

            <d-stack v-if="reviewContent.isJson" gap="32">
              <div v-for="(item, index) of reviewContent.data" :key="index">
                <div class="text-overline text--secondary">
                  Qiestion
                </div>
                <div class="text-h6 mb-4">
                  {{ item.question }}
                </div>
                <div v-html="item.answer" />
              </div>
            </d-stack>
            <div v-else v-html="reviewContent.data" />
          </d-stack>
        </d-layout-section-main>

        <d-layout-section-sidebar>
          <d-block-widget>
            <review-assessment
              v-model="reviewAssessment.scores"
              :content-type="content.contentType"
            />
          </d-block-widget>

          <d-block-widget>
            <users-list
              v-slot="{ users }"
              :team-id="project.researchGroup.external_id"
              view-type="dataProvider"
            >
              <review-vote
                :review="review"
                :members="users"
              />
            </users-list>
          </d-block-widget>

          <d-block-widget v-if="reviewSupporters.length">
            <users-list view-type="brief" class="my-n2" :users="reviewSupporters" />
          </d-block-widget>

          <d-block-widget>
            <v-row>
              <v-col>
                <div class="text-body-2 font-weight-medium">
                  Date Added:
                </div>
              </v-col>
              <v-col cols="auto">
                <d-meta-item :meta="{icon: 'event', label: moment(review.created_at).format('D MMM YYYY')}" />
              </v-col>
            </v-row>
          </d-block-widget>
        </d-layout-section-sidebar>
      </d-layout-section>
    </d-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import UsersList from '@/features/Users/components/List/UsersList';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewVote from '@/features/Reviews/components/Vote/ReviewVote';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import { isJsonString } from '@/utils/helpers';
  import { ResearchService } from '@deip/research-service';
  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ReviewDetails',
    components: {
      ReviewAssessment,
      DMetaItem,
      ReviewVote,
      DBlockWidget,
      UsersList,
      DBlock,
      DStack,
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection,
      DLayout
    },
    computed: {
      ...mapGetters({
        review: 'Review/reviewDetails',
        content: 'Content/contentDetails',
        project: 'Project/projectDetails'
      }),

      reviewContent() {
        const isJson = isJsonString(this.review.content);
        const cnt = this.review.content;
        return {
          isJson,
          data: isJson
            ? JSON.parse(cnt).map((item) => ({
              ...item,
              ...{
                answer: item.answer.replace(/<p><br><\/p>/gm, '')
              }
            }))
            : cnt
        };
      },

      permData() {
        return {
          groupPermalink: this.project.researchGroup.permlink,
          projectPermalink: this.project.permlink,
          contentPermalink: this.content.permlink
        };
      },

      reviewAssessment() {
        const disciplines = this.review.disciplines.map((d) => d.name);

        return {
          scores: this.review.scores.reduce((res, score) => ({
            ...res,
            ...{ [score[0]]: score[1] }
          }), {}),
          disciplines
        };
      },

      reviewSupporters() {
        return [...new Set(this.review.votes.map((v) => v.voter))];
      }
    },

    mounted() {
      // this.xxx();
    },

    methods: {
      // xxx() {
      //   this.$store.dispatch('rcd/loadResearchContentDetails', {
      //     group_permlink: decodeURIComponent(this.permData.groupPermalink),
      //     research_permlink: decodeURIComponent(this.permData.projectPermalink),
      //     content_permlink: decodeURIComponent(this.permData.contentPermalink),
      //     ref: this.$route.query.ref
      //   })
      //     .then(() => {
      //       this.$setReady();
      //     });
      // }

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>
