<template>
  <div>
    <d-layout>
      <d-layout-section class="fill-height">
        <d-layout-section-main>
          <d-stack gap="32">
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
                    <div v-if="user.profile" class="pt-1 text--secondary text-caption">
                      <span>{{ user | employmentOrEducation }}</span>
                      <span
                        v-if="hasLocation(user.profile)"
                      >, {{ user | userLocation }}</span>
                    </div>
                  </template>
                </users-list>
              </template>
            </d-block>

            <div v-html="review.content" />
          </d-stack>
        </d-layout-section-main>

        <d-layout-section-sidebar>
          <d-block-widget>
            <review-assessment
              v-model="reviewAssessment.scores"
              :research-content-type="content.contentType"
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
            <users-list view-type="brief" :users="reviewSupporters" />
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
  import ResearchContentReview from '@/components/research-content-details/ResearchContentReview';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import UsersList from '@/features/Users/components/List/UsersList';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewVote from '@/features/Reviews/components/Vote/ReviewVote';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'ReviewDetails',
    components: {
      DMetaItem,
      ReviewVote,
      DBlockWidget,
      UsersList,
      DBlock,
      DStack,
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection,
      DLayout,
      ResearchContentReview
    },
    computed: {
      ...mapGetters({
        review: 'Review/reviewDetails',
        content: 'Content/contentDetails'
      }),

      ...mapGetters({
        content: 'Content/contentDetails',
        project: 'Project/projectDetails'
      }),

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
      this.xxx();
    },

    methods: {
      xxx() {
        this.$store.dispatch('rcd/loadResearchContentDetails', {
          group_permlink: decodeURIComponent(this.permData.groupPermalink),
          research_permlink: decodeURIComponent(this.permData.projectPermalink),
          content_permlink: decodeURIComponent(this.permData.contentPermalink),
          ref: this.$route.query.ref
        })
          .then(() => {
            this.$setReady();
          });
      }
    }
  };
</script>
