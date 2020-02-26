<template>
  <v-layout>
    <v-flex class="px-5">

      <!-- <v-layout row wrap>
        <v-flex xs12>
          <research-details-fundraising />
        </v-flex>
      </v-layout> -->

      <v-layout row wrap>
        <v-flex xs12>
          <research-timeline :timeline="timeline" />
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <research-details-materials :isDetailsAvailable="true" />
        </v-flex>
      </v-layout>

      <v-layout row wrap class="my-4" v-if="isResearchGroupMember && !research.is_finished">
        <v-flex xs12>
          <research-details-draft-list />
        </v-flex>
        <v-flex xs12>
          <v-layout column class="mt-4">
            <div>
              <upload-research-content-file-dialog @onFinish="newContentUploaded" />
            </div>
            <div class="full-width">
              <v-btn
                @click="createDarDraft()"
                :loading="isCreatingDraft"
                :disabled="isCreatingDraft"
                block
                outline
                color="primary"
                dark
              >Use Editor</v-btn>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>

      <!-- <v-layout row wrap>
        <v-flex xs12>
          <research-details-eci ref="eci" />
        </v-flex>
      </v-layout> -->

      <!-- <v-layout row wrap>
        <v-flex xs12>
          <research-details-reviews />
        </v-flex>
      </v-layout> -->

    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { ResearchContentService } from "@deip/research-content-service";
import ResearchTimeline from "./ResearchTimeline";

const researchContentService = ResearchContentService.getInstance();

export default {
  name: "ResearchDetailsBody",

  components: {
    ResearchTimeline
  },

  data() {
    return {
      isCreatingDraft: false
    };
  },

  computed: {
    ...mapGetters({
      contentList: "rd/contentList",
      group: "rd/group",
      research: "rd/research",
      researchRef: "rd/researchRef"
    }),
    timeline() {
      let milestones = this.researchRef.milestones;
      let timeline = milestones.map((milestone, i) => {
        return {
          id: i + 1,
          date: moment
            .utc(milestone.eta)
            .local()
            .format("MMM DD, YYYY"),
          label: milestone.goal,
          description: milestone.details,
          budget: milestone.budget,
          purpose: milestone.purpose
        };
      });
      return timeline;
    },
    isResearchGroupMember() {
      return this.research
        ? this.$store.getters["auth/userIsResearchGroupMember"](
            this.research.research_group_id
          )
        : false;
    }
  },

  methods: {
    createDarDraft() {
      this.isCreatingDraft = true;
      researchContentService
        .createDarContent(this.research.id)
        .then(res => {
          // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
          // and doesn't persist new changes for several instances during the current session
          window.location.replace(
            `${window.location.href}/!draft?ref=${res.draft._id}`
          );
          location.reload();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isCreatingDraft = false;
        });
    },
    newContentUploaded() {
      Promise.all([
        this.$store.dispatch("rd/loadResearchContent", {
          researchId: this.research.id
        }),
        this.$store.dispatch("rd/loadResearchContentRefs", {
          researchId: this.research.id
        })
      ]).then(() => {
        this.$refs.eci.reloadDisciplineEciHistory();
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
