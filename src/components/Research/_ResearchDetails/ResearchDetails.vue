<template>
  <div v-if="$ready">
    <research-details-header />

    <v-divider />

    <template v-if="!members.includes($currentUserName)">
      <div class="px-12 py-3 text-right">
        <v-btn
          :color="bookmarked ? 'grey' : 'primary'"
          outlined
          small
          :loading="isBookmarkActionInProgress"
          @click="bookmarked ? removeFromBookmarks() : addToBookmarks()"
        >
          Follow
        </v-btn>
      </div>
      <v-divider />
    </template>


    <d-layout-section>
<!--      <research-details-milestones />-->

      <d-stack :gap="32">
        <attributes-read
          v-for="(attribute, index) in research.researchRef.attributes"
          :key="`${index}-attr`"
          :value="attribute.value"
          :attribute="attribute.researchAttributeId"
        />
      </d-stack>

      <research-details-contents />

      <template v-if="research.members.includes($currentUserName) && !research.is_finished">
        <research-details-contents
          class="mt-6"
          :drafts="true"
          title="Research materials drafts"
        />

        <!-- TODO: need move -->
        <upload-research-content-file-dialog class="mt-6" @onFinish="reloadContents()" />

        <v-btn
          :loading="isCreatingDraft"
          :disabled="isCreatingDraft"
          block
          outlined
          color="primary"
          dark
          class="mt-2"
          @click="createDarDraft()"
        >
          Use Editor
        </v-btn>
      </template>

      <research-details-reviews />

      <template #sidebar>
        <research-details-sidebar
          :research="research"
          :members="members"
        />
      </template>

    </d-layout-section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchDetailsHeader from '@/components/Research/ResearchDetails/ResearchDetailsHeader';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import ResearchDetailsMilestones from '@/components/Research/ResearchDetails/ResearchDetailsMilestones';
  import ResearchDetailsContents from '@/components/Research/ResearchDetails/ResearchDetailsContents';
  import UploadResearchContentFileDialog
    from '@/components/research-details/components/UploadResearchContentFileDialog';
  import { ResearchContentService } from '@deip/research-content-service';
  import ResearchDetailsReviews from '@/components/Research/ResearchDetails/ResearchDetailsReviews';
  import ResearchDetailsSidebar from '@/components/Research/ResearchDetails/ResearchDetailsSidebar';
  import AttributesRead from '@/components/Attributes/AttributesRead';
  import DStack from '@/components/Deipify/DStack/DStack';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ResearchDetailsTemp',

    components: {
      DStack,
      AttributesRead,
      ResearchDetailsSidebar,
      ResearchDetailsReviews,
      UploadResearchContentFileDialog,
      ResearchDetailsContents,
      ResearchDetailsMilestones,
      DLayoutSection,
      ResearchDetailsHeader
    },

    data() {
      return {
        isCreatingDraft: false,
        isBookmarkActionInProgress: false
      };
    },

    computed: {
      ...mapGetters({
        research: 'research/data',
        contents: 'research/contents',
        members: 'research/members',
        reviews: 'research/reviews',
      }),

      bookmarked() {
        this.$currentUser.researchBookmarks.includes(this.research.external_id);
      },
    },

    created() {
      this.getResearch()
        .then(() => {
          this.$setReady();
        });
    },
    methods: {
      getResearch() {
        return this.$store.dispatch('research/getResearch', this.$route.params.researchExternalId);
      },
      reloadContents() {
        this.$store.dispatch('research/getResearchContents', this.research.external_id);
      },
      createDarDraft() {
        this.isCreatingDraft = true;

        researchContentService
          .createDarContent(this.research.external_id)
          .then((res) => {
            // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
            // and doesn't persist new changes for several instances during the current session
            window.location.replace(
              `${window.location.href}/!draft?ref=${res.draft._id}`
            );
            location.reload();
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.isCreatingDraft = false;
          });
      },
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
