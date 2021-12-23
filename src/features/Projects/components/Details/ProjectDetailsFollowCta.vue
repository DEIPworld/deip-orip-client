<template>
  <v-btn
    v-if="$isUser"
    small
    outlined
    :loading="loading"
    :disabled="loading"
    @click="toggleBookmark()"
  >
    <v-icon left>
      {{ bookmarkId ? 'mdi-bookmark-minus' : 'mdi-bookmark-plus-outline' }}
    </v-icon>
    {{ bookmarkId ? $t('projectDetails.removeBookmark') : $t('projectDetails.addBookmark') }}
  </v-btn>
</template>

<script>
  import { BookmarkService } from '@deip/bookmark-service';
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import { USER_BOOKMARK_TYPE } from '@/variables';

  const bookmarkService = BookmarkService.getInstance();

  export default {
    name: 'ProjectDetailsFollowCta',

    mixins: [projectDetails],

    data() {
      return {
        loading: false
      };
    },

    computed: {
      bookmarkId() {
        const bookmark = this.$currentUser.bookmarks.find(
          (b) => b.ref === this.project._id && b.type === USER_BOOKMARK_TYPE.PROJECT
        );

        return bookmark ? bookmark._id : false;
      }
    },

    methods: {
      bookmarkService() {
        return !this.bookmarkId
          ? bookmarkService.createProjectBookmark(this.$currentUser.username, this.project._id)
          : bookmarkService.deleteProjectBookmark(this.$currentUser.username, this.bookmarkId);
      },

      toggleBookmark() {
        this.loading = true;

        return this.bookmarkService()
          .then(() => {
            this.$store.dispatch('Bookmarks/fetch', this.$currentUser.username);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
