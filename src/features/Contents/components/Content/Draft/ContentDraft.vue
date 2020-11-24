<template>
  <d-layout-full-screen
    content-width="1200"
    title="Edit draft"
    class="fill-height"
    color="grey lighten-4"
    full-width
  >
    <div v-if="$ready" class="draft-editor">
      <content-dar
        ref="ContentDar"
        :dar-id="`draft-${draftId}`"
        class="fill-height"
        @change="onDraftChange"
      />
    </div>

    <portal to="sidebar">
      <div class="">
        <v-navigation-drawer app right clipped width="320">
          <d-stack class="pa-6">

            <v-select
              v-model="internalContentType"
              :items="contentTypes"
              label="Content Type"
              outlined
              item-value="id"
              hide-details="auto"
            />

            <user-selector
              v-model="internalAuthors"
              label="Authors"
              :users="project.members"
              multiple
              return-object
            />

            <d-autocomplete
              v-model="internalReferences"
              :items="allReferences"
              multiple
              chips
              deletable-chips
              label="References"
              item-text="title"
              hide-details="auto"
              return-object
            >
              <template #item="{ item } ">
                {{ item.title }}
              </template>
            </d-autocomplete>

          </d-stack>

          <template #append>
            <v-divider />
            <d-stack horizontal gap="8" class="pa-6">
              <v-btn color="primary" outlined small>Save draft</v-btn>
              <v-btn color="primary" small>Create proposal</v-btn>
            </d-stack>
          </template>
        </v-navigation-drawer>
      </div>
    </portal>

  </d-layout-full-screen>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { contentDraftStore } from '@/features/Contents/store';
  import ContentDar from '@/features/Contents/components/Content/Dar/ContentDar';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DStack from '@/components/Deipify/DStack/DStack';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import { mapGetters } from 'vuex';
  import { arrayDiff } from 'vuetify/lib/util/helpers';
  import { researchContentTypes } from '@/variables';

  export default {
    name: 'ContentDraft',
    components: {
      DAutocomplete,
      UserSelector,
      DStack,
      DLayoutFullScreen,
      ContentDar
    },
    mixins: [
      componentStoreFactoryOnce(contentDraftStore)
    ],

    props: {
      draftId: {
        type: String,
        default: null
      },
      projectExternalId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        internalAuthors: [],
        internalReferences: [],
        internalContentType: null,

        contentTypes: researchContentTypes,

        formModel: {
          title: null,
          authors: [],
          references: []
        }
      };
    },

    computed: {
      ...mapGetters({
        project: 'Project/projectDetails',
        allReferences: 'ContentDraft/allReferences'
      })
    },

    watch: {
      internalAuthors(newVal, oldVal) {
        if (oldVal.length > newVal.length) {
          this.$refs.ContentDar.removeAuthors(arrayDiff(newVal, oldVal));
        } else if (oldVal.length < newVal.length) {
          this.$refs.ContentDar.addAuthors(arrayDiff(oldVal, newVal));
        }
      },
      internalReferences(newVal, oldVal) {
        if (oldVal.length > newVal.length) {
          this.$refs.ContentDar.removeReferences(arrayDiff(newVal, oldVal));
        } else if (oldVal.length < newVal.length) {
          this.$refs.ContentDar.addReferences(arrayDiff(oldVal, newVal));
        }
      }
    },

    created() {
      this.$store.dispatch('ContentDraft/getAllReferences')
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      onDraftChange(data) {
        this.formModel = { ...data };
      }
    }
  };
</script>

<style lang="scss">
  .draft-editor {
    position: absolute;
    width: 100%;
    left: 0;
    top: 48px;
    bottom: 0;

    > .deip-texture > .sc-app > .sc-texture > .sc-article-panel > .sc-manuscript-view > .se-main-section {
      > .se-toolbar-wrapper {
        position: fixed;
        left: 0;
        right: 320px;
        top: 64px;
        box-shadow: none !important;
        border-bottom: 1px solid var(--color-divider);
        background: #fff;
        padding: 4px 16px !important;
      }

      > .se-content-section {
        .se-toc-pane {
          position: relative;
          z-index: 2;
          overflow: auto;
          max-height: calc(100vh - 64px - 49px);

          .se-toc-entries {
            padding: 48px !important;
          }

          .sc-toc-entry:empty {
            display: none !important;
          }
        }

        .se-scrollable {
          margin-left: -250px;
          padding: 48px 48px 48px 250px;
        }

        .se-content {
          max-width: 800px;
          background: #fff;
          box-shadow: 0 2px 4px rgba(#000, .2);
        }
      }

      .se-footer-pane {
        border-top: 0 !important;
      }
    }

    .sc-toolbar {
      max-width: 100% !important;
    }

    .sc-button {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      flex-basis: fit-content !important;
    }

    .sc-button + .sc-button {
      margin-left: 8px;
    }

    .sc-tool-dropdown {
      padding: 0 8px;
    }
    .sc-tool-spacer {
      flex: 1 !important;
    }

  }
</style>
