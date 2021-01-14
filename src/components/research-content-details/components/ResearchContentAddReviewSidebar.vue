<template>
  <div>
    <d-block-widget v-if="research">
      <router-link
        class="a title"
        :to="{
          name: 'ResearchContentDetails',
          params: {
            research_group_permlink: encodeURIComponent(research.research_group.permlink),
            research_permlink: encodeURIComponent(research.permlink),
            content_permlink: encodeURIComponent(content.permlink)
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
<!--          You will get <span class="font-weight-bold">approximately 3000 ECI reward in {{ userRelatedExpertise.map(exp => exp.discipline_name).join(', ') }}</span>-->
<!--          for your contribution to this project-->
<!--        </div>-->
<!--      </div>-->
<!--    </d-block-widget>-->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import { AccessService } from '@deip/access-service';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchContentAddReviewSidebar',
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
        const criterias = researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.content.content_type);
        return criterias.some((criteria) => this.assessmentCriteria[criteria.id] === undefined || this.assessmentCriteria[criteria.id] == 0);
      }
    },

    methods: {
      publishReview() {
        bus.$emit('reviewEditor:exportHtml', (html) => {
          this.isLoading = true;
          const reviewData = html;
          const researchContentCriterias = researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.content.content_type);
          const researchContentExternalId = this.content.external_id;
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

          const extensions = [];

          return researchContentReviewsService.createReview(this.user.privKey, {
            author: this.user.username,
            researchContentExternalId,
            content: reviewData,
            weight,
            assessment,
            disciplines,
            extensions
          })
            .then((data) => {
              this.$notifier.showSuccess(this.$t('researchContentDetails.addRev.pubSucc'));
              this.$router.push({
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
                  research_permlink: encodeURIComponent(this.research.permlink),
                  content_permlink: encodeURIComponent(this.content.permlink)
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
