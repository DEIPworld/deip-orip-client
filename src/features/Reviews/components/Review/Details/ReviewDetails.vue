<template>
  <div>
    <research-content-review />

<!--    <d-layout>-->
<!--      <d-layout-section class="fill-height">-->
<!--        <d-layout-section-main>-->
<!--          <d-stack gap="32">-->
<!--            <d-block>-->
<!--              <template #title>-->
<!--                <div class="text-overline text&#45;&#45;secondary">-->
<!--                  Author-->
<!--                </div>-->
<!--                <users-list-->
<!--                  :users="review.author"-->
<!--                  view-type="brief"-->
<!--                  avatar-size="80"-->
<!--                >-->
<!--                  <template #item-info="{ user, hasLocation }">-->
<!--                    <div v-if="user.profile" class="pt-1 text&#45;&#45;secondary text-caption">-->
<!--                      <span>{{ user | employmentOrEducation }}</span>-->
<!--                      <span-->
<!--                        v-if="hasLocation(user.profile)"-->
<!--                      >, {{ user | userLocation }}</span>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </users-list>-->
<!--              </template>-->
<!--            </d-block>-->

<!--            <div v-html="review.content" />-->
<!--          </d-stack>-->

<!--          {{ review }}-->
<!--        </d-layout-section-main>-->
<!--        <d-layout-section-sidebar>-->

<!--          <d-block-widget>-->
<!--            <div class="text-h6">-->
<!--              <router-link-->
<!--                class="link"-->
<!--                :to="{-->
<!--                  name: 'project.content.details',-->
<!--                  params: {-->
<!--                    contentExternalId: content.externalId,-->
<!--                  }-->
<!--                }"-->
<!--              >-->
<!--                {{ content.title }}-->
<!--              </router-link>-->
<!--            </div>-->
<!--          </d-block-widget>-->

<!--          <d-block-widget>-->
<!--            <review-assessment-->
<!--              v-model="reviewAssessment.scores"-->
<!--              :research-content-type="content.contentType"-->
<!--            />-->
<!--          </d-block-widget>-->

<!--          <d-block-widget>-->
<!--            <users-list-->
<!--              v-slot="{ users }"-->
<!--              view-type="dataProvider">-->
<!--              {{users}}-->
<!--            </users-list>-->
<!--&lt;!&ndash;            <review-vote&ndash;&gt;-->
<!--&lt;!&ndash;              :review="review"&ndash;&gt;-->
<!--&lt;!&ndash;              :members="project.members"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--          </d-block-widget>-->

<!--        </d-layout-section-sidebar>-->
<!--      </d-layout-section>-->
<!--    </d-layout>-->
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

  export default {
    name: 'ReviewDetails',
    components: {
      ReviewVote,
      DBlockWidget,
      UsersList, DBlock, DStack, DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection, DLayout, ResearchContentReview
    },
    computed: {
      ...mapGetters({
        review: 'Review/reviewDetails',
        content: 'Content/contentDetails',
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
