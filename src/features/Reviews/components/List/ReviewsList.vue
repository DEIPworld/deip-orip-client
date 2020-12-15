<template>
  <d-block>
    <template #title>
      <v-badge
        :content="internalReviews.length"
        :value="internalReviews.length"
      >
        {{ $t('reviews.reviews') }}
      </v-badge>
    </template>

    <template v-if="!check(disableReviewRequestRoute)" #title-append>
      <review-request
        :project-id="projectId"
        :content-id="contentId"
        :reviewer-conditions="{disciplineId, exclude: excludeUsers}"
      />
    </template>

    <v-divider />

    <template v-if="$ready && internalReviews.length">
      <div>
        <template v-for="(review, index) of internalReviews">
          <v-row :key="`review-${index}`" class="text-body-2" no-gutters>
            <v-col cols="12" md="wide">
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
            </v-col>

            <v-sheet width="64" />

            <v-col cols="12" md="wide">
              <d-stack gap="8">
                <template v-if="review.contentData">
                  <div class="text-caption text--secondary">
                    <span class="font-weight-medium">Review to:</span>
                    {{ getResearchContentType(review.contentData.contentType).text }}
                  </div>
                  <div>

                    <router-link
                      v-if="!check(disableContentRoute)"
                      class="link text--primary"
                      :to="{
                        name: 'project.content.details',
                        params: {
                          contentExternalId: review.contentData.externalId,
                          researchExternalId: $route.params.researchExternalId,
                        }
                      }"
                    >
                      {{ review.contentData.title }}
                    </router-link>
                    <span v-else>
                      {{ review.contentData.title }}
                    </span>

                  </div>
                </template>

                <div class="text-caption text--secondary">
                  {{ review.disciplines.join(', ') }}
                </div>

                <d-meta-item
                  class="text-caption"
                  icon="event"
                  :label="moment(review.createdAt).format('D, MMM YYYY')"
                />
              </d-stack>
            </v-col>

            <v-sheet width="64" />

            <v-col cols="12" md="wide">
              <d-block :title-margin="8">
                <template #title>
                  <div class="text-caption text--secondary">
                    <div class="font-weight-medium">
                      {{ $t('reviews.assessment') }}
                    </div>
                  </div>
                </template>

                <template #title-append>
                  <v-btn
                    v-if="$isLoggedIn"
                    small
                    height="20"
                    :disabled="check(disableReviewRoute)"
                    color="primary"
                    text
                    :to="{
                      name: 'project.content.review.details',
                      params: {
                        researchExternalId: $route.params.researchExternalId,
                        contentExternalId: review.contentData.externalId,
                        reviewExternalId: review.externalId,
                      }
                    }"
                  >
                    {{ $t('reviews.seeReview') }}
                  </v-btn>
                </template>

                <div v-if="review.supporters.length">
                  <v-tooltip tag="div" bottom>
                    <template #activator="{ on }">
                      <div class="d-flex justify-end" v-on="on">
                        <div class="half-bold align-self-center pr-2">
                          {{ review.supporters.length }}
                        </div>
                        <v-icon>group_add</v-icon>
                      </div>
                    </template>
                    <div v-if="review.supporters.length">
                      {{ $t('reviews.expertsSupp', { supportersCount: review.supporters.length }) }}
                    </div>
                  </v-tooltip>
                </div>

                <review-assessment
                  v-model="review.scores"
                  :content-type="review.contentData.contentType"
                />
              </d-block>
            </v-col>
          </v-row>
          <v-divider
            v-if="index < internalReviews.length - 1"
            :key="`review-d-${index}`"
            class="my-6"
          />
        </template>
      </div>
      <v-divider />
    </template>

    <v-row class="text-body-2 align-center" no-gutters>
      <v-col>
        <slot name="create-messages">
          <div v-if="!internalReviews.length" class="mb-2">
            {{ $t('reviews.noReviews') }}
          </div>
          <div v-if="userRelatedExpertise.length && !isReseachGroupMember">
            {{
              $hasModule(DEIP_MODULE.APP_ECI)
                ? $t('reviews.eciForReview', { countEci: 3000, disciplines: userRelatedExpertise.map(exp => exp.discipline_name).join(', ') })
                : ''
            }}
          </div>
          <div v-else-if="!userRelatedExpertise.length || isReseachGroupMember">
            {{
              $hasModule(DEIP_MODULE.APP_ECI)
                ? $t('reviews.needExpertiseAndNotMembers', { disciplines: project.disciplines.map(d => d.name).join(', ') })
                : $t('reviews.needNotMembers')
            }}
          </div>
        </slot>
      </v-col>
      <v-col v-if="!check(disableCreateRoute)" cols="auto">
        <v-btn
          color="primary"
          small
          :to="{
            name: 'project.content.review.create',
            params: $route.params
          }"
        >
          Add Review
        </v-btn>
      </v-col>
    </v-row>
    <v-divider v-if="$hasModule(DEIP_MODULE.APP_ECI)" />
  </d-block>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { reviewsListStore } from '@/features/Reviews/store/reviewsListStore';

  import { mapGetters, mapState } from 'vuex';

  import { ResearchService } from '@deip/research-service';
  import UsersList from '@/features/Users/components/List/UsersList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import ReviewRequest from '@/features/Reviews/components/Request/ReviewRequest';
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';
  import ReviewAssessment from '@/features/Reviews/components/Assessment/ReviewAssessment';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ReviewsList',
    components: {
      ReviewAssessment,
      ReviewRequest,
      DBlock,
      DMetaItem,
      DStack,
      UsersList
    },
    mixins: [
      componentStoreFactory(reviewsListStore),
      dataContextSwitch
    ],
    props: {
      projectId: {
        type: String,
        default: null
      },
      contentId: {
        type: String,
        default: null
      },
      excludeUsers: {
        type: [Array, String],
        default: () => []
      },

      disableAllRoutes: Boolean,
      disableContentRoute: Boolean,
      disableReviewRoute: Boolean,
      disableReviewRequestRoute: Boolean,
      disableCreateRoute: Boolean,
    },
    computed: {
      ...mapState({
        reviews(state, getters) { return getters[`${this.storeNS}/reviewsList`]; }
      }),

      ...mapGetters({
        project: 'Project/projectDetails',
        userExperise: 'auth/userExperise'
      }),

      internalReviews() {
        const transformed = this.reviews.map((review) => {
          const disciplines = review.disciplines.map((d) => d.name);

          const model = {
            ...review,

            scores: review.scores.reduce((res, score) => ({
              ...res,
              ...{ [score[0]]: score[1] }
            }), {}),
            disciplines
          };

          return model;
        });

        return transformed;
      },
      userRelatedExpertise() {
        return this.userExperise.filter(
          (exp) => exp.amount > 0 && this.project.disciplines.some(
            (d) => d.id === exp.discipline_id
          )
        );
      },
      isReseachGroupMember() {
        return this.$store.getters['auth/userIsResearchGroupMemberExId'](this.project.researchGroup.external_id);
      },
    },
    created() {
      this.updateData();
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch(`${this.storeNS}/getReviews`, {
            ...this.$$dataContextProps
          })
        ])
          .then(() => {
            this.$setReady(true);
          });
      },

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      },

      check(target) {
        return this.disableAllRoutes || target
      }

    }
  };
</script>
