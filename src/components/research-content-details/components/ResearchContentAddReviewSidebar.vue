<template>
  <div>
    <d-block-widget v-if="research">
      <router-link
        class="a title"
        :to="{
          name: 'project.content.details',
          params: {
            projectId: research.external_id,
            contentId: content.external_id
          }
        }"
      >
        {{ content.title }}
      </router-link>
    </d-block-widget>

    <d-block-widget v-if="!!research">
      <review-assessment
        v-model="assessmentCriteria"
        :content-type="content.content_type"
        :readonly="false"
      />
    </d-block-widget>

<!--    <d-block-widget>-->
<!--      <v-btn-->
<!--        color="primary"-->
<!--        block-->
<!--        :disabled="isReviewPublishingDisabled"-->
<!--        :loading="isLoading"-->
<!--        @click="publishReview()"-->
<!--      >-->
<!--        Publish-->
<!--      </v-btn>-->
<!--      <div class="pt-4 text-caption">-->
<!--        <div>-->
<!--          You will get <span class="font-weight-bold">ECI reward in {{ userRelatedExpertise.map(exp => exp.discipline_name).join(', ') }}</span>-->
<!--          for your contribution to this project-->
<!--        </div>-->
<!--      </div>-->
<!--    </d-block-widget>-->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ReviewService } from '@deip/review-service';
  import { bus } from '@/main';
  import { reviewsChore } from '@/mixins/chores';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const reviewService = ReviewService.getInstance();

  export default {
    name: 'ResearchContentAddReviewSidebar',
    mixins: [reviewsChore],
    components: { ReviewAssessment, DBlockWidget, DBlock },
    data() {
      return {
        isLoading: false,
        assessmentCriteria: {}
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        content: 'rcd/content',
        research: 'rcd/research'
      }),
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.research.disciplines.some((d) => d.id == exp.discipline_id));
      },

      isReviewPublishingDisabled() {
        const assessmentCriterias = this.$$getAssessmentCriterias(this.content.content_type);
        return assessmentCriterias.some((criteria) => this.assessmentCriteria[criteria.id] === undefined || this.assessmentCriteria[criteria.id] == 0);
      }
    },

    methods: {
      publishReview() {
        bus.$emit('reviewEditor:exportHtml', (html) => {
          this.isLoading = true;
          const reviewData = html;
          const projectContentId = this.content.external_id;
          const weight = '100.00 %';
          const scores = Object.keys(this.assessmentCriteria).reduce((scores, key) => {
            const val = this.assessmentCriteria[key];
            return [...scores, [parseInt(key), parseInt(val)]];
          }, []);

          const disciplines = this.userRelatedExpertise.map((exp) => exp.discipline_external_id);

          const assessment = [
            'multicriteria_scoring_assessment_model',
            {
              scores,
              extensions: []
            }
          ];

          return reviewService.createReview({
            initiator: {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            projectContentId,
            content: reviewData,
            weight,
            assessment,
            disciplines
          })
            .then((data) => {
              this.$notifier.showSuccess(this.$t('researchContentDetails.addRev.pubSucc'));
              this.$router.push({
                name: 'project.content.details',
                params: {
                  projectId: this.research.external_id,
                  contentId: this.content.external_id
                },
                hash: '#reviews'
              });
            })
            .catch((err) => {
              console.error(err);
              this.$notifier.showError(this.$t('researchContentDetails.addRev.pubFail'));
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
