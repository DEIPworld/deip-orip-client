<template>
  <div>
    <div class="pb-4" v-if="research">
      <router-link class="a title"
          :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(research.group_permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(content.permlink)
              }
          }"
      >{{ content.title }}
      </router-link>
    </div>
    <div>
      <review-assessment v-model="assessmentCriteria" :researchContentType="content.content_type"
                         :readonly="false"></review-assessment>
    </div>

    <div class="py-2">
      <v-btn color="primary"
             block
             @click="publishReview()"
             :disabled="isReviewPublishingDisabled"
             :loading="isLoading"
      >Publish
      </v-btn>
      <div class="pt-2">
        <div>You will get <span class="body-2">approximately 3000 ECI reward in {{relatedExpertise.map(exp => exp.discipline_name).join(', ')}}</span>
          for your contribution to this project
        </div>
      </div>
    </div>

    <!-- <div class="pt-4 pb-2">
      <v-card class="pa-4">
        <div class="bold subheading pb-2">Related Expertise Tokens:</div>
        <div class="pt-2" v-for="(exp, index) in relatedExpertise" :key="index">
          <span>{{exp.discipline_name}}</span>
          <span class="right half-bold">{{exp.amount}}</span>
        </div>
      </v-card>
      <div class="warning--text pt-3">
        <v-icon color="orange">warning</v-icon>
        100% of your Expertise Tokens will be locked for 24 hours after you will have published the review
      </div>
    </div> -->

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
        return this.userExperise.filter(exp => this.research.disciplines.find(d => d.id == exp.discipline_id));
      },

      isReviewPublishingDisabled() {
        let criterias = researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.content.content_type);
        return criterias.some(criteria => {
          return this.assessmentCriteria[criteria.id] === undefined || this.assessmentCriteria[criteria.id] == 0;
        })
      }
    },

    methods: {
      publishReview() {
        bus.$emit('reviewEditor:exportHtml', (html) => {
          this.isLoading = true;
          let reviewData = html;
          let researchContentCriterias = researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.content.content_type);
          let researchContentId = this.content.id;
          let weight = this.DEIP_100_PERCENT;
          let scores = Object.keys(this.assessmentCriteria).reduce((scores, key) => {
            let val = this.assessmentCriteria[key];
            return [...scores, [parseInt(key), parseInt(val)]];
          }, []);

          let assessment = [
            "multicriteria_scoring_assessment_model_v1_0_0",
            {
              "version": "1.0.0",
              "scores": scores
            }
          ];
          let extensions = [];

          return researchContentReviewsService.makeReview(
            this.user.username,
            researchContentId,
            reviewData,
            weight,
            assessment,
            extensions
          )
            .then((data) => {
              this.$store.dispatch('layout/setSuccess', {
                message: 'Your review has been published successfully !'
              });
              this.$router.push({
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(this.research.group_permlink),
                  research_permlink: encodeURIComponent(this.research.permlink),
                  content_permlink: encodeURIComponent(this.content.permlink)
                },
                hash: '#reviews'
              });
            })
            .catch((err) => {
              console.log(err)
              this.$store.dispatch('layout/setError', {
                message: 'An error occurred while adding review, please try again later'
              });
            })
            .finally(() => {
              this.isLoading = false
            });
        });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
