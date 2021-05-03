<template>
  <div v-if="hasReviewRequests">
    <div id="review-requests" class="text-h6 font-weight-medium">
      <v-badge
        color="warning"
        inline
        :content="$currentUser.reviewRequests.length"
      >
        {{ $t('userDetailRouting.sidebar.reviewReq') }}
      </v-badge>
    </div>
    <v-divider class="my-2" />
    <v-carousel
      v-model="reviewsSlider"
      hide-delimiters
      :show-arrows="false"
      light
      height="auto"
    >
      <v-carousel-item
        v-for="(reviewRequest, index) of $currentUser.reviewRequests"
        :key="`review-request-${index}`"
      >
        <d-box-item
          :avatar="reviewRequest.requestorProfile.profile | avatarSrc(64, 64)"
          :size="40"
          class="align-end"
        >
          <router-link
            class="a full-width break-word font-weight-medium"
            :to="{
              name: 'UserDetails',
              params: { account_name: reviewRequest.requestorProfile.account.name }
            }"
          >
            <v-clamp
              autoresize
              :max-lines="1"
              class="text-body-2 font-weight-medium"
            >
              {{ reviewRequest.requestorProfile | accountFullname }}
            </v-clamp>
          </router-link>
          <div class="text-caption text--secondary">
            {{ $t('userDetailRouting.sidebar.reqYouReview',
                  { title: reviewRequest.research.title }) }}
          </div>
        </d-box-item>
      </v-carousel-item>
    </v-carousel>
    <div class="d-flex justify-space-between align-center">
      <div>
        <v-icon
          v-if="$currentUser.reviewRequests.length > 1"
          class="mr-4"
          @click="prevSlide('reviewsSlider', $currentUser.reviewRequests)"
        >
          navigate_before
        </v-icon>
        <v-icon
          v-if="$currentUser.reviewRequests.length > 1"
          @click="nextSlide('reviewsSlider', $currentUser.reviewRequests)"
        >
          navigate_next
        </v-icon>
      </div>
      <v-btn
        text
        small
        class="ml-1"
        color="primary"
        @click="goToReview($currentUser.reviewRequests[reviewsSlider])"
      >
        {{ $t('userDetailRouting.sidebar.viewBtn') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  export default {
    name: 'AccountReviewRequests',

    components: {
      DBoxItem
    },

    data() {
      return {
        reviewsSlider: 0
      };
    },

    computed: {
      hasReviewRequests() {
        return this.$currentUser.reviewRequests.length;
      }
    },

    methods: {
      nextSlide(slider, sliderItems) {
        this[slider] === sliderItems.length - 1 ? this[slider] = 0 : this[slider]++;
      },
      prevSlide(slider, sliderItems) {
        this[slider] === 0 ? this[slider] = sliderItems.length - 1 : this[slider]--;
      },

      goToReview(review) {
        this.$router.push(
          {
            name: 'project.content.details',
            params: {
              projectId: review.research.external_id,
              contentId: review.content.external_id
            }
          }
        );
      }
    }
  };
</script>
