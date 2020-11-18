<template>
  <d-block>
    <template #title>
      <v-badge
        :content="internalReviews.length || '0'"
      >
        Reviews
      </v-badge>
    </template>

    <!-- just representation -->
    <template #title-append>
      <v-btn outlined color="primary" small>
        Request Expert Review
      </v-btn>
    </template>

    <v-divider />

    <div
      v-if="$ready && internalReviews.length && contents.length"
      :class="limitAccessClasses"
      v-bind="limitAccessProps"
    >
      <template v-for="(review, index) of internalReviews">
        <!--        {{review}}-->
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
              <template v-if="review.researchContent">
                <div class="text-caption text--secondary">
                  <span class="font-weight-medium">Review to:</span>
                  {{ getResearchContentType(review.researchContent.content_type).text }}
                </div>
                <div>
                  <router-link
                    class="link"
                    tag="div"
                    :to="routeAccessCheck({
                      name: 'project.content.details',
                      params: {
                        contentExternalId: review.researchContent.external_id,
                        researchExternalId: projectId,
                      }
                    })"
                  >
                    {{ review.researchContent.title }}
                  </router-link>
                </div>
              </template>

              <div class="text-caption text--secondary">
                {{ review.disciplines.join(', ') }}
              </div>

              <d-meta-item
                class="text-caption"
                icon="event"
                :label="moment(review.created_at).format('D, MMM YYYY')"
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
                <!-- START TEMP SOLUTION (query) -->
                <v-btn
                  small
                  text
                  class="my-n3"
                  color="primary"
                  :disabled="limitedAccess"
                  :to="routeAccessCheck({
                    name: 'ResearchContentReview',
                    params: {
                      research_group_permlink: research.researchGroup.permlink,
                      content_permlink: review.researchContentPermlink,
                      research_permlink: research.permlink,
                      review_id: review.id
                    }
                  })"
                >
                  <!-- END TEMP SOLUTION (query) -->

                  <!-- <v-btn
                  small
                  color="primary"
                  outlined
                  :to="routeAccessCheck({
                    name: 'research.review.details',
                    params: {
                      reviewExternalId: review.researchContent.external_id,
                      researchExternalId: projectId,
                    }
                  })"
                > -->
                  See review
                </v-btn>
              </template>

              <review-assessment
                v-model="review.scores"
                :research-content-type="review.researchContent.content_type"
              />

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
            </d-block>
          </v-col>
        </v-row>
        <v-divider v-if="index < internalReviews.length - 1" :key="`review-d-${index}`" class="my-6" />
      </template>
    </div>
  </d-block>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { reviewsListStore } from '@/features/Reviews/store/reviewsList';
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import { ResearchService } from '@deip/research-service';
  import { limitAccess } from '@/mixins/limitAccess';
  import UsersList from '@/features/Users/components/List/UsersList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ReviewsList',
    components: {
      DBlock,
      DMetaItem,
      DStack,
      UsersList
    },
    mixins: [
      componentStoreFactoryOnce(reviewsListStore, 'ResearchReviews'),
      limitAccess
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
      userName: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        reviews: 'ResearchReviews/list',
        contents: 'ProjectContents/list', // temp
        research: 'Project/data' // temp
      }),

      internalReviews() {
        const transformed = this.reviews.map((review) => {
          const disciplines = review.disciplines.map((d) => d.name);

          /// ////// START TEMP SOLUTION (contentPermlink) /////////
          const contentPermlink = this.contents.find(
            // eslint-disable-next-line camelcase
            ({ external_id }) => external_id === review.research_content_external_id
          );
          const researchContentPermlink = contentPermlink ? contentPermlink.permlink : '';
          /// ////// END TEMP SOLUTION (contentPermlink) /////////

          const model = {
            ...review,
            /// ////// START TEMP SOLUTION (contentPermlink) /////////
            researchContentPermlink,
            /// ////// END TEMP SOLUTION (contentPermlink) /////////

            scores: review.scores.reduce((res, score) => ({
              ...res,
              ...{ [score[0]]: score[1] }
            }), {}),

            researchContent: this.$where(this.contents, { isDraft: false })
              .find(
                (c) => c.id === review.research_content_id
              ),
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
          this.$store.dispatch('ResearchReviews/getReviews', this.projectId)
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
