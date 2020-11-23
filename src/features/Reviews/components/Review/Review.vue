<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { reviewDetailsStore } from '@/features/Reviews/store';

  export default {
    name: 'Review',

    mixins: [
      componentStoreFactoryOnce(reviewDetailsStore)
    ],

    props: {
      reviewId: {
        type: String,
        required: true
      }
    },

    created() {
      this.$store.dispatch('Review/getReviewDetails', this.reviewId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
