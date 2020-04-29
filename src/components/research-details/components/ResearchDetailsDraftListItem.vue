<template>
<v-expansion-panel>
  <v-expansion-panel-header>
      <v-row align="center" @click.stop>
        <v-col cols="2" class="text-capitalize bold">
          Draft {{ index + 1 }}
        </v-col>
        <v-col cols="10">
          <span class="bold">
            <a class="a" @click="openDarDraft(draft)">{{ draft.title || draft._id }}</a>
          </span>
          <span v-if="isDraftProposed(draft)" class="ml-2 orange--text">(proposed)</span>
        </v-col>
      </v-row>
  </v-expansion-panel-header>
  <v-expansion-panel-content>

    <v-card class="elevation-0">
      <v-card-text class="pl-6 pa-0">
        <v-row align="center" justify="space-between">
          <div>
            <span>
              <v-icon size="18px">date_range</v-icon>
              <span>{{ draft.updated_at | dateFormat('D MMM YYYY HH:mm', true) }}</span>
            </span>
            <span class="ml-2">
              <v-icon size="18px">note_add</v-icon>
              <span>{{ draft.type }}</span>
            </span>
          </div>
          <div>
            <v-btn
              v-if="isDraftInProgress(draft)"
              :loading="isDeletingDraft"
              :disabled="isDeletingDraft"
              outlined
              small
              depressed
              color="red lighten-1"
              @click="deleteDraft(draft)"
            >
              Delete
            </v-btn>
            <v-btn
              outlined
              small
              depressed
              color="primary lighten-1"
              @click="openDarDraft(draft)"
            >
              View
            </v-btn>
          </div>
        </v-row>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>

  </v-expansion-panel>
</template>

<script>
  import { ResearchContentService } from '@deip/research-content-service';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ResearchDetailsDraftListItem',

    props: {
      draft: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data() {
      return {
        isDeletingDraft: false
      };
    },
    methods: {
      openDarDraft(draft) {
        if (draft.type === 'dar' && draft.status === 'in-progress') {
          // we have to do it this way as Texture InMemory buffer is getting flushed after the first saving
          // and doesn't persist new changes for several instances during the current session
          window.location.replace(
            `${window.location.href}/!draft?ref=${draft._id}`
          );
          location.reload();
        } else {
          const params = {
            group_permlink: this.$route.params.research_group_permlink,
            research_permlink: this.$route.params.research_permlink,
            content_permlink: '!draft'
          };
          const query = { ref: draft._id };
          this.$router.push({
            name: 'ResearchContentDetails',
            params,
            query
          });
        }
      },
      isDraftProposed(draft) {
        return draft.status === 'proposed';
      },
      isDraftInProgress(draft) {
        return draft.status === 'in-progress';
      },
      deleteDraft(draft) {
        this.isDeletingDraft = true;
        researchContentService
          .deleteContentDraft(draft._id)
          .then(() => {
            this.$store.dispatch('rd/loadResearchContentRefs', {
              researchId: draft.researchId
            });
          })
          .finally(() => {
            this.isDeletingDraft = false;
          });
      }
    }
  };
</script>

<style scoped>
</style>
