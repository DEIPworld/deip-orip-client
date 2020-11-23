<template>
  <d-block>
    <template #title>
      <v-badge
        :content="internalReviews.length"
        :value="internalReviews.length"
      >
        Reviews
      </v-badge>
    </template>

    <template v-if="!limitedAccess" #title-append>
      <review-request
        :project-id="projectId"
      />
    </template>

    <v-divider />

    <div
      :class="limitAccessClasses"
      v-bind="limitAccessProps"
    >
      <div v-if="$ready && internalReviews.length">
        <template v-for="(review, index) of internalReviews">
          <v-row :key="`review-${index}`" class="text-body-2" no-gutters>
            <v-col cols="12" md="wide">
              <users-list
                :users="review.author"
                view-type="brief"
                avatar-size="80"
              >
                <template #item-info="{ user }">
                  <div v-if="user.profile" class="pt-1 text--secondary text-caption">
                    <span>{{ user | employmentOrEducation }}</span>
                    <span
                      v-if="doesUserHaveLocation(user.profile)"
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
                      class="link"
                      tag="div"
                      :to="routeAccessCheck({
                        name: 'project.content.details',
                        params: {
                          contentExternalId: review.contentData.externalId,
                          researchExternalId: $route.params.researchExternalId,
                        }
                      })"
                    >
                      {{ review.contentData.title }}
                    </router-link>
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
              <d-block :title-margin="16">
                <template #title>
                  <div class="text-caption text--secondary">
                    <div class="font-weight-medium">
                      Assessment
                    </div>
                  </div>
                </template>

                <template #title-append>
                  <v-btn
                    small
                    color="primary"
                    outlined
                    :to="routeAccessCheck({
                      name: 'project.content.review.details',
                      params: {
                        researchExternalId: $route.params.researchExternalId,
                        contentExternalId: review.contentData.externalId,
                        reviewExternalId: review.externalId,
                      }
                    })"
                  >
                    See review
                  </v-btn>
                </template>

                <div v-if="review.supporters.length" class="pt-2">
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
                      {{ review.supporters.length }} experts supported this review
                    </div>
                  </v-tooltip>
                </div>

                <review-assessment
                  v-model="review.scores"
                  :research-content-type="review.contentData.contentType"
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
      <div v-else class="text-body-2">
        No reviews yet.
      </div>
    </div>

  </d-block>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { reviewsListStore } from '@/features/Reviews/store/reviewsListStore';

  import { mapState } from 'vuex';

  import { ResearchService } from '@deip/research-service';
  import { limitAccess } from '@/mixins/limitAccess';
  import UsersList from '@/features/Users/components/List/UsersList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import ReviewRequest from '@/features/Reviews/components/Request/ReviewRequest';
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ReviewsList',
    components: {
      ReviewRequest,
      DBlock,
      DMetaItem,
      DStack,
      UsersList
    },
    mixins: [
      componentStoreFactory(reviewsListStore),
      limitAccess,
      dataContextSwitch,
    ],
    computed: {
      ...mapState({
        reviews(state, getters) { return getters[`${this.storeNS}/reviewsList`]; },
        contents(state, getters) { return getters[`${this.storeNS}/contentsList`]; }
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
      }
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

      doesUserHaveLocation(userProfile) {
        return (
          userProfile.location
          && (userProfile.location.country || userProfile.location.city)
        );
      },

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }

    }
  };
</script>
