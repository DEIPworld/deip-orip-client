<template>
  <div>
    <d-block-widget v-if="project">
      <router-link
        class="a title"
        :to="{
          name: 'project.content.details',
          params: {
            projectId: project._id,
            contentId: content._id
          }
        }"
      >
        {{ content.title }}
      </router-link>
    </d-block-widget>

    <d-block-widget v-if="!!project">
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
<!--          You will get <span class="font-weight-bold">ECI reward in {{ userRelatedExpertise.map(exp => exp.domainName).join(', ') }}</span>-->
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
    name: 'ProjectContentAddReviewSidebar',
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
        project: 'rcd/project'
      }),
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.project.domains.some((d) => d.id == exp.domainId));
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
          const projectContentId = this.content._id;

          const scores = Object.keys(assessmentCriteria)
            .reduce((sc, key) => {
              const val = assessmentCriteria[key];
              sc[parseInt(key)] = parseInt(val);
              return sc;
            }, {});

          const domains = this.userRelatedExpertise.map((exp) => exp.domainId);
          const assessment = { type: 1, scores };

          return reviewService.createReview({
            initiator: {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            projectContentId,
            content: reviewData,
            assessment,
            domains: domains
          })
            .then(() => {
              this.$notifier.showSuccess(this.$t('projectContentDetails.addRev.pubSucc'));
              this.$router.push({
                name: 'project.content.details',
                params: {
                  projectId: this.project._id,
                  contentId: this.content._id
                },
                hash: '#reviews'
              });
            })
            .catch((err) => {
              console.error(err);
              this.$notifier.showError(this.$t('projectContentDetails.addRev.pubFail'));
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
