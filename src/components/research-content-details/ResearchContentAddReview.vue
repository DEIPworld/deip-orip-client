<template>
  <d-layout-full-screen
    title="Submit review"
    @click-back="$router.push({
      name: 'ResearchContentDetails',
      params: {
        research_group_permlink: encodeURIComponent(research.research_group.permlink),
        research_permlink: encodeURIComponent(research.permlink),
        content_permlink: encodeURIComponent(content.permlink)
      }
    })"
  >
<!--    <pre>{{ JSON.stringify(formModel, null, 2) }}</pre>-->
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form @submit.prevent="handleSubmit(publishReview)">
        <d-stack gap="32">
          <d-block title="Subject" title-margin="16">
            <div class="text-body-2">
              {{ getResearchContentType(content.content_type).text }}:
              {{ content.title }}
              in Project:
              {{ research.title }}

              <!--              <router-link-->
              <!--                class="link"-->
              <!--                :to="{-->
              <!--                  name: 'project.content.details',-->
              <!--                  params: {-->
              <!--                    contentExternalId: content.external_id,-->
              <!--                    researchExternalId: research.external_id-->
              <!--                  }-->
              <!--                }"-->
              <!--              >-->
              <!--                {{ content.title }}-->
              <!--              </router-link>-->
            </div>
          </d-block>

          <d-block title="Review questions and resume" title-margin="16">
            <validation-provider
              ref="validator"
              v-slot="{ errors, validate }"
              name="Review questions and resume"
              rules="required"
            >
              <vex-wysiwyg
                v-model="formModel.reviewData"
                :error-messages="errors"
              />
            </validation-provider>
          </d-block>

          <d-block title="Assesment" title-margin="16">
            <review-assessment
              v-model="formModel.assessmentCriteria"
              :research-content-type="content.content_type"
              :readonly="false"
              :columns="2"
              :gutter="64"
            />
          </d-block>

          <d-block title="Reward" title-margin="16">
            <div class="text-body-2">
              3000 ECI (approximately) in
              {{
                userRelatedExpertise.map(exp => exp.discipline_name)
                  .join(', ')
              }}
              for your contribution to this project.
              <br>
              800.00 USD for completing review before the deadline.
            </div>
          </d-block>

          <v-divider />

          <div class="text-right">
            <v-btn
              color="primary"
              type="submit"
              :disabled="isReviewPublishingDisabled || loading || invalid"
              :loading="loading"
            >
              Publish
            </v-btn>
          </div>
        </d-stack>
      </v-form>
    </validation-observer>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import { ValidationObserver, ValidationProvider } from 'vee-validate';

  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import { mapGetters } from 'vuex';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { ResearchService } from '@deip/research-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const researchService = ResearchService.getInstance();

  const genPlaceholder = (str, required, classes) => {
    const attrs = [
      `data-label="${str}"`,
      'data-id="keep"',
      'spellcheck="false"'
    ];
    if (required) {
      attrs.push(`data-required="${required}"`);
    }

    const classList = ['ql-placeholder', ...(classes ? classes.split(' ') : [])].join(' ');

    return `<span class="${classList}" ${attrs.join(' ')}>${str}</span>`;
  };

  const defaultReviewData = [
    'Do you recommend the submission for funding?',
    'Describe the strength or weaknesses of the submissions',
    'How well does the submission align with the mission?'
  ].reduce((res, q) => ([
    ...res,
    ...[
      `<div class="text-overline text--secondary mb-1">${genPlaceholder('Question', true)}</div>`,
      `<div class="text-h6">${genPlaceholder(q, true)}</div>`,
      `<p>${genPlaceholder('Your Answer', false, 'text--secondary')}</p>`
    ]
  ]), []).join('');

  export default {
    name: 'ResearchContentAddReview',
    components: {
      DStack,
      DBlock,
      DLayoutFullScreen,

      ValidationObserver,
      ValidationProvider
    },
    data() {
      return {
        formModel: {
          reviewData: defaultReviewData,
          assessmentCriteria: {}
        },
        loading: false
      };
    },

    computed: {
      ...mapGetters({
        content: 'rcd/content',
        research: 'rcd/research',
        userExperise: 'auth/userExperise'
      }),

      userRelatedExpertise() {
        return this.userExperise
          .filter((exp) => exp.amount > 0 && this.research.disciplines.some((d) => d.id === exp.discipline_id));
      },

      isReviewPublishingDisabled() {
        const criterias = researchContentReviewsService
          .getAssessmentCriteriasForResearchContent(this.content.content_type);

        const { assessmentCriteria } = this.formModel;

        return criterias
          .some((criteria) => assessmentCriteria[criteria.id] === undefined
            || assessmentCriteria[criteria.id] === 0);
      }
    },

    created() {},

    methods: {

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      },

      publishReview() {
        this.loading = true;

        const { assessmentCriteria, reviewData } = this.formModel;

        const researchContentExternalId = this.content.external_id;

        const weight = '100.00 %';
        const scores = Object.keys(assessmentCriteria)
          .reduce((scores, key) => {
            const val = assessmentCriteria[key];
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

        // console.log(this.$currentUser.privKey, {
        //   author: this.$currentUserName,
        //   researchContentExternalId,
        //   content: reviewData,
        //   weight,
        //   assessment,
        //   disciplines,
        //   extensions
        // })

        return researchContentReviewsService.createReviewViaOffchain(this.$currentUser.privKey, {
          author: this.$currentUserName,
          researchContentExternalId,
          content: reviewData,
          weight,
          assessment,
          disciplines,
          extensions
        })
          .then(() => {
            this.$notifier.showSuccess('Your review has been published successfully !');

            this.$router.push({
              name: 'project.details',
              params: {
                researchExternalId: this.research.external_id
              },
              hash: '#reviews'
            });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while adding review, please try again later');
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
