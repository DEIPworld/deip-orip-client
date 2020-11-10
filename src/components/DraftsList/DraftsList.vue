<template>
  <v-data-table
    v-if="drafts.length"
    :headers="tableHeaders"
    :items="drafts"
    disable-sort
    disable-pagination
    hide-default-footer
  >
    <template #item.type="{item}">
      Draft
    </template>

    <template #item.title="{item}">
      <span class="bold">
        <a class="a" @click="openDarDraft(item)">{{ item.title || item._id }}</a>
      </span>
      <span v-if="isDraftProposed(item)" class="ml-2 orange--text">(proposed)</span>
    </template>

    <template #item.del="{item}">
      <d-simple-tooltip v-if="isDraftInProgress(item)" tooltip="Remove draft">
        <v-btn
          icon
          small
          @click="deleteDraft(item)"
        >
          <v-icon small>
            delete
          </v-icon>
        </v-btn>
      </d-simple-tooltip>
    </template>

  </v-data-table>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { draftsListStore } from '@/components/DraftsList/store';
  import { mapGetters } from 'vuex';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'DraftsList',
    components: {
      DMetaItem,
      DSimpleTooltip,
    },
    mixins: [componentStoreFactoryOnce(draftsListStore, 'ResearchDrafts')],
    props: {
      researchId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        expanded: [],
        isDeletingDraft: false,
        tableHeaders: [
          {
            text: 'Type',
            value: 'type',
            width: '0%'
          },
          {
            text: 'Title',
            value: 'title',
            width: '70%'
          },
          {
            value: 'del',
            width: '10%'
          },
          {
            text: '',
            value: 'data-table-expand'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        drafts: 'ResearchDrafts/list',
        research: 'Project/data'
      })
    },
    created() {
      this.updateData();
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch('ResearchDrafts/getDrafts', this.$route.params.researchExternalId)
        ])
          .then(() => {
            this.$setReady(true);
          });
      },
      openDarDraft(draft) {
        if (draft.type === 'dar') {
          // we have to reload the window as Texture InMemory buffer is getting flushed after the first saving
          // and doesn't persist new changes for several instances during the current session
          // window.location.replace(`${window.location.href}/!draft?ref=${draft._id}`);
          // location.reload();
          //////////////// START TEMP SOLUTION ///////////////////
          this.$router.push({
            path: `/${decodeURIComponent(this.research.researchGroup.permlink)}/research/${decodeURIComponent(this.research.permlink)}/!draft?ref=${draft._id}`
          });
          //////////////// END TEMP SOLUTION ///////////////////
        } else {
          const params = {
            research_group_permlink: this.research.researchGroup.permlink,
            research_permlink: this.research.permlink,
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
        this.$store.dispatch('ResearchDrafts/deleteDraft', draft._id)
          .finally(() => {
            this.isDeletingDraft = false;
          });
      }
    }
  };
</script>
