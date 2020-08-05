<template>
  <v-sheet>
    <research-details-fundraising />
    <research-details-investors />
    <research-timeline :timeline="timeline" />
    <research-details-materials :is-details-available="true" />

    <div v-if="isResearchGroupMember && !research.is_finished">
      <research-details-draft-list />
      <upload-research-content-file-dialog @onFinish="newContentUploaded" />
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
    </div>

    <research-details-reviews />
  </v-sheet>
</template>

<script>
  import moment from 'moment';
  import { mapGetters } from 'vuex';
  import { ResearchContentService } from '@deip/research-content-service';
  import ResearchDetailsFundraising from '@/components/research-details/components/ResearchDetailsFundraising';
  import ResearchDetailsInvestors from '@/components/research-details/components/ResearchDetailsInvestors';
  import ResearchDetailsMaterials from '@/components/research-details/components/ResearchDetailsMaterials';
  import ResearchDetailsDraftList from '@/components/research-details/components/ResearchDetailsDraftList';
  import UploadResearchContentFileDialog
    from '@/components/research-details/components/UploadResearchContentFileDialog';
  import ResearchDetailsReviews from '@/components/research-details/components/ResearchDetailsReviews';
  import ResearchTimeline from './ResearchTimeline.vue';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ResearchDetailsBody',

    components: {
      ResearchDetailsReviews,
      UploadResearchContentFileDialog,
      ResearchDetailsDraftList,
      ResearchDetailsMaterials,
      ResearchDetailsInvestors,
      ResearchDetailsFundraising,
      ResearchTimeline
    },

    data() {
      return {
        isCreatingDraft: false
      };
    },

    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        group: 'rd/group',
        research: 'rd/research',
        researchRef: 'rd/researchRef'
      }),
      timeline() {
        const { milestones } = this.researchRef;
        const timeline = milestones.map((milestone, i) => ({
          id: i + 1,
          date: moment
            .utc(milestone.eta)
            .local()
            .format('MMM DD, YYYY'),
          label: milestone.goal,
          description: milestone.details,
          budget: milestone.budget,
          purpose: milestone.purpose
        }));
        return timeline;
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      }
    },

    methods: {
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
      newContentUploaded() {
        Promise.all([
          this.$store.dispatch('rd/loadResearchContent', { researchExternalId: this.research.external_id })
        ])
          .then(() => {
            this.$refs.eci.reloadDisciplineEciHistory();
          });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
