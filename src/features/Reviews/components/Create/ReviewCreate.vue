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
                :to="{ name: 'project.details', params: { projectId: project._id } }"
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
              title-margin="16"
            >
              <div class="text-body-2">
                ECI in
                {{
                  userRelatedExpertise.map(exp => exp.domainName)
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
  import { ValidationObserver, ValidationProvider } from 'vee-validate';
  import { ReviewService } from '@deip/review-service';
  import { ProjectContentService } from '@deip/project-content-service';
  import { mapGetters } from 'vuex';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import { reviewsChore } from '@/mixins/chores';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';

  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const projectContentService = ProjectContentService.getInstance();
  const reviewService = ReviewService.getInstance();

  export default {
    name: 'ReviewCreate',
    components: {
      ReviewAssessment,
      DStack,
      DBlock,
      DLayoutFullScreen,

      ValidationObserver,
      ValidationProvider
    },
    mixins: [reviewsChore],

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
          .filter((exp) => exp.amount > 0 && this.project.domains.some((id) => id === exp.domainId));
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
      const questions = this.$portalSettings.reviewQuestions.map((q) => q.question);
      this.questions.push(...questions);
      this.formModel.reviewData.push(...questions.map(() => []));

      return reviewService.getReviewRequestsByExpert(this.$currentUser.username, 1)
        .then(({ data: { items: res } }) => {
          const request = res.find((r) => r.projectContentId === this.content._id);
          if (request) {
            this.requestAccepted = false;
            this.requestData = request;
          }
          this.$setReady();
        });
    },

    methods: {

      getProjectContentType(type) {
        return projectContentService.getProjectContentType(type);
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

        return reviewService.denyReviewRequest(this.requestData._id)
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
          projectContentId: this.content._id,
          content: JSON.stringify(this.reviewData),
          assessment,
          domains
        })
          .then(() => {
            this.$notifier.showSuccess('Your review has been published successfully !');

            this.$router.push({
              name: 'project.details',
              params: {
                projectId: this.project._id
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
