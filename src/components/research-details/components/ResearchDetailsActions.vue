<template>
  <div class="ml-auto">
    <v-btn
      v-if="!bookmarkId"
      color="primary"
      outlined
      small
      :loading="isBookmarkActionInProgress"
      @click="addToBookmarks()"
    >
      {{ $t('researchDetails.follow') }}
    </v-btn>

    <v-btn
      v-else
      color="grey"
      outlined
      small
      :loading="isBookmarkActionInProgress"
      @click="removeFromBookmarks()"
    >
      {{ $t('researchDetails.unfollow') }}
    </v-btn>
  </div>
</template>

<script>

  import { UserService } from '@deip/user-service';
  import { mapGetters } from 'vuex';

  const userService = UserService.getInstance();

  export default {
    name: 'ResearchDetailsActions',

    data() {
      return {
        bookmarkId: null,
        isBookmarkActionInProgress: false
      };
    },

    computed: {
      ...mapGetters({
        research: 'rd/research',
        user: 'auth/user'
      })
    },

    created() {
      const bookmark = this.user.researchBookmarks.find(
        (b) => b.researchId === this.research.external_id
      );
      if (bookmark) {
        this.bookmarkId = bookmark._id;
      }
    },

    methods: {
      addToBookmarks() {
        this.isBookmarkActionInProgress = true;
        return userService
          .createResearchBookmark(this.user.username, this.research.external_id)
          .then((bookmark) => {
            this.$store.dispatch('auth/loadResearchBookmarks');
            this.bookmarkId = bookmark._id;
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.isBookmarkActionInProgress = false;
          });
      },

      removeFromBookmarks() {
        this.isBookmarkActionInProgress = true;
        return userService
          .removeResearchBookmark(this.user.username, this.bookmarkId)
          .then(() => {
            this.$store.dispatch('auth/loadResearchBookmarks');
            this.bookmarkId = null;
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.isBookmarkActionInProgress = false;
          });
      }

    }
  };
</script>

<style scoped>

</style>
