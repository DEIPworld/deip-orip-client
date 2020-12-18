<template>
  <v-btn
    v-if="$isUser"
    small
    outlined
    :loading="loading"
    :disabled="loading"
    @click="toggleBookmark()"
  >
    {{bookmarkId}}
    <v-icon left>
      {{ bookmarkId ? 'mdi-bookmark-minus' : 'mdi-bookmark-plus-outline' }}
    </v-icon>
    {{ bookmarkId ? 'Remove bookmark' : 'Add bookmark' }}
  </v-btn>
</template>

<script>
  import { UserService } from '@deip/user-service';
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';

  const userService = UserService.getInstance();

  export default {
    name: 'ResearchDetailsFollowCta',

    mixins: [projectDetails],

    data() {
      return {
        loading: false
      };
    },

    computed: {
      bookmarkId() {
        const bookmark = this.$currentUser.bookmarks.find(
          (b) => b.ref === this.project.externalId && b.type === 'research'
        );

        return bookmark ? bookmark._id : false;
      }
    },

    methods: {
      bookmarkService() {
        return !this.bookmarkId
          ? userService.createResearchBookmark(this.$currentUser.username, this.project.externalId)
          : userService.removeResearchBookmark(this.$currentUser.username, this.bookmarkId);
      },

      toggleBookmark() {
        this.loading = true;

        return this.bookmarkService()
          .then(() => {
            this.$store.dispatch('Auth/getUserBookmarks');
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
