<template>
  <d-layout-full-screen
    title="Submit review"
    @click-back="$router.push({
      name: 'project.content.details',
      params: {
        contentId: contentId
      }
    })"
  >
    <template v-if="$ready">
      <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
        <v-form @submit.prevent="handleSubmit(publishReview)">
          <d-stack gap="32">
            <d-stack gap="4">
              <div class="text-overline">
                Project
              </div>
              <router-link
                :to="{ name: 'project.details', params: { projectId: project.externalId } }"
                class="link text--primary text-decoration-none"
              >
                {{ project.title }}
                <v-icon size="20">
                  mdi-arrow-top-right-thin-circle-outline
                </v-icon>
              </router-link>
            </d-stack>
            <d-stack gap="4">
              <div class="text-overline">
                Subject
              </div>
              <div class="text-h3">
                <span class="font-weight-regular">
                  Review on {{ getProjectContentType(content.contentType).text }}:
                  {{ content.title }}
                </span>
              </div>
            </d-stack>

            <d-block>
              <div
                v-for="(question, index) of questions"
                :key="index"
              >
                <validation-provider
                  ref="validator"
                  v-slot="{ errors, validate }"
                  name="question"
                  rules="required"
                >
                  <div class="text-overline text--secondary">
                    Question {{ index + 1 }}
                  </div>
                  <div class="text-h6 mb-2">
                    {{ question }}
                  </div>
                  <vex-wysiwyg
                    v-if="requestAccepted"
                    v-model="formModel.reviewData[index]"
                    :error-messages="errors"
                    placeholder="Your answer"
                    :disabled="!requestAccepted"
                  />
                </validation-provider>
              </div>
            </d-block>

            <d-block title="Assesment" title-margin="16">
              <review-assessment
                v-model="formModel.assessmentCriteria"
                :content-type="content.contentType"
                :readonly="!requestAccepted"
                :columns="2"
                :gutter="64"
              />
            </d-block>

            <d-block
              v-if="$hasModule(DEIP_MODULE.APP_ECI)"
              title="Reward"
              title-margin="16">
              <div class="text-body-2">
                ECI in
                {{
                  userRelatedExpertise.map(exp => exp.discipline_name)
                    .join(', ')
                }}
                for your contribution to this project.
              </div>
            </d-block>

            <v-divider />

            <div class="d-flex align-center">
              <validation-provider
                ref="s"
                v-slot="{ errors, validate }"
                name="Confirmation"
                :rules="{required: {allowFalse: false}}"
              >
                <v-switch
                  v-model="formModel.confirm"
                  :disabled="!requestAccepted"
                  label="Declare no competing interests exist"
                  class="ma-0 pa-0"
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
              <v-spacer />
              <template v-if="requestAccepted">
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="isReviewPublishingDisabled || loading || invalid"
                  :loading="loading"
                >
                  Publish
                </v-btn>
              </template>

              <template v-else>
                <v-btn
                  color="primary"
                  text
                  @click="rejectReviewRequest"
                >
                  Reject
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="loading"
                  :loading="loading"
                  @click="acceptReviewRequest"
                >
                  <!-- Publish -->
                  Accept review invitation
                </v-btn>
              </template>
            </div>
          </d-stack>
        </v-form>
      </validation-observer>
    </template>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import { ValidationObserver, ValidationProvider } from 'vee-validate';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import { mapGetters } from 'vuex';
  import { reviewsChore } from '@/mixins/chores';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { ResearchContentService } from '@deip/research-content-service';
  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ReviewCreate',
    mixins: [reviewsChore],
    components: {
      ReviewAssessment,
      DStack,
      DBlock,
      DLayoutFullScreen,

      ValidationObserver,
      ValidationProvider
    },

    props: {
      projectId: {
        type: String,
        default: null
      },
      contentId: {
        type: String,
        default: null
      }
    },

    data() {

      return {
        formModel: {
          reviewData: [],
          assessmentCriteria: {},
          confirm: false
        },
        loading: false,

        questions: [],

        requestAccepted: true,
        requestData: {}
      };
    },

    computed: {
      ...mapGetters({
        content: 'Content/contentDetails',
        project: 'Project/projectDetails',
        userExperise: 'auth/userExperise'
      }),

      userRelatedExpertise() {
        return this.userExperise
          .filter((exp) => exp.amount > 0 && this.project.disciplines.some((d) => d.id === exp.discipline_id));
      },

      isReviewPublishingDisabled() {
        const assessmentCriterias = this.$$getAssessmentCriterias(this.content.contentType);
        const { assessmentCriteria } = this.formModel;

        return assessmentCriterias
          .some((criteria) => assessmentCriteria[criteria.id] === undefined
            || assessmentCriteria[criteria.id] === 0);
      },

      reviewData() {
        return this.questions.map((q, i) => ({
          question: q,
          answer: this.formModel.reviewData[i]
        }));
      }
    },

    created() {
      // TODO: rethink
      const questions = this.$tenantSettings.reviewQuestions.map(q => q.question);
      this.questions.push(...questions);
      this.formModel.reviewData.push(...questions.map(() => []));

      return researchContentReviewsService.getReviewRequestsByExpert(this.$currentUser.username, 'pending')
        .then((res) => {
          const request = res.find((r) => r.researchContentExternalId === this.content.externalId);
          if (request) {
            this.requestAccepted = false;
            this.requestData = request;
          }
          this.$setReady();
        });
    },

    methods: {

      getProjectContentType(type) {
        return researchContentService.getResearchContentType(type);
      },

      acceptReviewRequest() {
        this.requestAccepted = true;
        this.$nextTick(() => window.scrollTo({
          top: 0,
          behavior: 'smooth'
        }));
      },

      rejectReviewRequest() {
        this.loading = true;

        return researchContentReviewsService.denyReviewRequest(this.requestData._id)
          .then(() => {
            this.$router.push({
              name: 'project.content.details',
              params: {
                projectId: this.projectId,
                contentId: this.contentId
              }
            });
          });
      },

      publishReview() {
        this.loading = true;

        const { assessmentCriteria } = this.formModel;

        const weight = '100.00 %';
        const scores = Object.keys(assessmentCriteria)
          .reduce((sc, key) => {
            const val = assessmentCriteria[key];
            return [...sc, [parseInt(key), parseInt(val)]];
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

        return researchContentReviewsService.createReview(this.$currentUser.privKey, {
          author: this.$currentUser.username,
          researchContentExternalId: this.content.externalId,
          content: JSON.stringify(this.reviewData),
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
                projectId: this.project.externalId
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
