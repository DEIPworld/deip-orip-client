<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { contentDetailsStore } from '@/features/Contents/store';

  export default {
    name: 'ContentDataProvider',

    mixins: [
      componentStoreFactoryOnce(contentDetailsStore, 'Content')
    ],

    props: {
      contentId: {
        type: String,
        required: true
      }
    },
    created() {
      this.$store.dispatch('Content/getContentDetails', this.contentId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
