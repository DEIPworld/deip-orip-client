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
                    params: $route.params
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
                {{ getProjectContentType(content.contentType).text }}:
                <router-link
                  v-if="contentAssessAllowed"
                  :to="{
                    name: 'project.content.details',
                    params: $route.params
                  }"
                  class="link text--primary"
                >
                  {{ content.title }}
                </router-link>
                <template v-else>
                  {{ content.title }}
                </template>
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
                  <template #item-info="{ user, hasLocation, hasEmplOrEduc }">
                    <div v-if="user.profile" class="pt-1 text-body-2">
                      <d-stack v-if="hasLocation(user.profile)" horizontal gap="9">
                        <v-icon small>
                          mdi-map-marker
                        </v-icon>
                        <div>{{ user | userLocation }}</div>
                      </d-stack>
                      <d-stack v-if="hasEmplOrEduc(user.profile)" horizontal gap="9">
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
              :team-id="project.teamId"
              view-type="dataProvider"
            >
              <review-vote
                :review="review"
                :members="users"
                @vote="onVote"
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
  import { isJsonString, portalAttributesToObject } from '@/utils/helpers';
  import { ProjectContentService } from '@deip/project-content-service';

  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  import { projectDetails, projectContext } from '@/features/Projects/mixins/projectDetails';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  const projectContentService = ProjectContentService.getInstance();

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
    mixins: [attributesChore],
    computed: {
      ...mapGetters({
        review: 'Review/reviewDetails',
        content: 'Content/contentDetails',
        projectRaw: 'Project/projectDetails'
      }),

      project() {
        return {
          ...this.projectRaw,
          createdAt: this.$options.filters.dateFormat(this.projectRaw.createdAt, 'D MMM YYYY', true),
          attributes: portalAttributesToObject(this.projectRaw.attributes)
        };
      },

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


      reviewAssessment() {
        const domains = this.review.domains.map((d) => d.name);

        return {
          scores: this.review.assessment.model.scores,
          domains
        };
      },

      reviewSupporters() {
        return [...new Set(this.review.votes.map((v) => v.upvoter))];
      },

      ...projectDetails.computed
    },

    methods: {
      getProjectContentType(type) {
        return projectContentService.getProjectContentType(type);
      },

      onVote() {
        this.$store.dispatch('Review/getReviewDetails', this.review._id);
      },

      ...projectDetails.methods,
      ...projectContext.methods
    }
  };
</script>
