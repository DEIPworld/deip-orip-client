<template>
  <div>
    <div v-if="research" class="pb-6">
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
    </div>
    <div>
      <review-assessment
        v-model="assessmentCriteria"
        :research-content-type="content.content_type"
        :readonly="false"
      />
    </div>

    <div class="py-6">
      <v-btn
        color="primary"
        block
        :disabled="isReviewPublishingDisabled"
        :loading="isLoading"
        @click="publishReview()"
      >
        Publish
      </v-btn>
      <div class="pt-4">
        <div>
          You will get <span class="font-weight-bold">approximately 3000 ECI reward in {{ relatedExpertise.map(exp => exp.discipline_name).join(', ') }}</span>
          for your contribution to this project
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import { AccessService } from '@deip/access-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchContentAddReviewSidebar',

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
      relatedExpertise() {
        return this.userExperise.filter((exp) => this.research.disciplines.find((d) => d.id == exp.discipline_id));
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
          const researchContentId = this.content.id;
          const weight = this.DEIP_100_PERCENT;
          const scores = Object.keys(this.assessmentCriteria)
            .reduce((scores, key) => {
              const val = this.assessmentCriteria[key];
              return [...scores, [parseInt(key), parseInt(val)]];
            }, []);

          const assessment = [
            'multicriteria_scoring_assessment_model_v1_0_0',
            {
              version: '1.0.0',
              scores
            }
          ];
          const extensions = [];

          return researchContentReviewsService.createReviewViaOffchain(
            this.user.username,
            researchContentId,
            reviewData,
            weight,
            assessment,
            extensions
          )
            .then((data) => {
              this.$notifier.showSuccess('Your review has been published successfully !')
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
              console.log(err);
              this.$notifier.showError('An error occurred while adding review, please try again later')
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
