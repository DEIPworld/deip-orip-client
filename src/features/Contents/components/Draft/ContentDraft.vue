<template>
  <d-layout-full-screen
    content-width="1200"
    title="Edit draft"
    class="fill-height"
    color="grey lighten-4"
    full-width
  >
    <div class="draft-editor">
      <content-dar
        ref="contentDar"
        :dar-id="draftId"
        class="fill-height"
        @change="onDraftChange"
      />
    </div>

    <portal to="sidebar">
      <validation-observer v-slot="{ invalid, handleSubmit, errors }" ref="observer">
        <v-navigation-drawer
          app
          right
          clipped
          width="320"
        >
          <validation-provider
            ref="titleValidator"
            immediate
            name="Title"
            rules="required"
          >
            <input v-model="formModel.title" type="hidden">
          </validation-provider>

          <validation-provider
            ref="bodyValidator"
            immediate
            name="Main text"
            rules="required"
          >
            <input v-model="formModel.body" type="hidden">
          </validation-provider>

          <d-stack class="pa-6">
            <validation-provider
              name="Content Type"
              rules="required"
            >
              <v-select
                v-model="formModel.contentType"
                :items="contentTypes"
                label="Content Type"
                :error-messages="errors['Content Type']"
                outlined
                item-value="id"
                hide-details="auto"
              />
            </validation-provider>

            <validation-provider
              name="Authors"
              rules="required"
            >
              <user-selector
                ref="userSelector"
                v-model="formModel.authors"
                label="Authors"
                :error-messages="errors['Authors']"
                :users="project.members"
                multiple
                return-object
              />
            </validation-provider>

            <references-selector
              ref="referencesSelector"
              v-model="formModel.references"
              label="References"
              multiple
              return-object
            />
          </d-stack>

          <template #append>
            <v-divider />
            <d-stack gap="8" class="pa-6">
              <d-stack horizontal gap="8">
                <v-btn
                  color="primary"
                  outlined
                  small
                  :disabled="loadingDraft || loadingPublish"
                  :loading="loadingDraft"
                  @click="saveDraft()"
                >
                  Save draft
                </v-btn>
                <v-btn
                  :disabled="loadingPublish || invalid || loadingDraft"
                  :loading="loadingPublish"
                  color="primary"
                  small
                  @click="handleSubmit(createContent)"
                >
                  Publish
                </v-btn>
              </d-stack>
              <div v-if="filteredErrors(errors).length" class="text-caption text--secondary">
                * To create proposal, please, fill in at least
                {{ filteredErrors(errors).join(' and ') }}
              </div>
            </d-stack>

          </template>
        </v-navigation-drawer>
      </validation-observer>
    </portal>
  </d-layout-full-screen>
</template>

<script>
  import ContentDar from '@/features/Contents/components/Dar/ContentDar';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DStack from '@/components/Deipify/DStack/DStack';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';
  import { mapGetters } from 'vuex';
  import { arrayDiff } from 'vuetify/lib/util/helpers';
  import { researchContentTypes } from '@/variables';
  import ReferencesSelector from '@/features/References/components/Selector/ReferencesSelector';
  import { ResearchContentService } from '@deip/research-content-service';
  import { ValidationObserver, ValidationProvider } from 'vee-validate';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ContentDraft',
    components: {
      ReferencesSelector,
      UserSelector,
      DStack,
      DLayoutFullScreen,
      ContentDar,
      ValidationObserver,
      ValidationProvider
    },

    props: {
      draftId: {
        type: String,
        default: null
      },
      projectId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        contentTypes: researchContentTypes,

        internalUsers: [],
        internalReferences: [],

        loadingPublish: false,
        loadingDraft: false,
        ready: false,

        formModel: {
          title: null,
          contentType: null,
          authors: [],
          references: []
        },

        cache: `cache-${this.draftId}`
      };
    },

    computed: {
      ...mapGetters({
        project: 'Project/projectDetails'
      })
    },

    watch: {
      'formModel.authors': {
        handler(newVal, oldVal) {
          if (newVal !== oldVal && this.ready) {
            if (oldVal.length > newVal.length) {
              this.$refs.contentDar.removeAuthors(arrayDiff(newVal, oldVal));
            } else if (oldVal.length < newVal.length) {
              this.$refs.contentDar.addAuthors(arrayDiff(oldVal, newVal));
            }
          }
        }
      },
      'formModel.references': {
        handler(newVal, oldVal) {
          if (newVal !== oldVal && this.ready) {
            if (oldVal.length > newVal.length) {
              this.$refs.contentDar.removeReferences(arrayDiff(newVal, oldVal));
            } else if (oldVal.length < newVal.length) {
              this.$refs.contentDar.addReferences(arrayDiff(oldVal, newVal));
            }
          }
        }
      }
    },

    created() {
      this.$nextTick(() => {
        Promise.all([
          new Promise((resolve) => this.$refs.contentDar.$once('ready', resolve)),
          new Promise((resolve) => this.$refs.userSelector.$once('ready', resolve)),
          new Promise((resolve) => this.$refs.referencesSelector.$once('ready', resolve))
        ])
          .then(([data, users, references]) => {
            if (this.$ls.get(this.cache)) {
              this.formModel = this.$ls.get(this.cache);
            }

            this.internalUsers = users;
            this.internalReferences = references;

            this.setFormModel(data);

            this.$nextTick(() => {
              this.ready = true;
            });
          });
      });
    },

    methods: {
      onDraftChange(data) {
        this.setFormModel(data);
      },

      filteredErrors(errors) {
        const err = [];

        for (const e of ['Title', 'Main text']) {
          if (errors[e] && errors[e].length) err.push(e);
        }

        return err;
      },

      setFormModel(data) {
        this.formModel = {
          ...data,
          ...{
            contentType: this.formModel.contentType,
            authors: this.$where(
              this.internalUsers,
              {
                account: { name: data.authors.map((a) => a.alias) }
              }
            ),
            references: this.$where(
              this.internalReferences,
              {
                externalId: data.references.map((ref) => ref.uri.split('/')
                  .pop())
              }
            )
          }
        };
      },

      saveDraft() {
        this.loadingDraft = true;

        researchContentService.getResearchContentRef(this.draftId)
          .then((res) => {
            if (res.status === 'in-progress') {
              this.$refs.contentDar.saveDocument(() => {
                this.$notifier.showSuccess('Document draft has been saved !');
              });
            } else {
              this.$notifier.showError('Document draft is locked for editing !');
            }
          })
          .finally(() => {
            this.loadingDraft = false;
            this.$ls.set(this.cache, this.formModel);
          });
      },

      createContent() {
        this.loadingPublish = true;

        return new Promise((resolve) => {
          this.$refs.contentDar.saveDocument(resolve);
        })
          .then(() => researchContentService.getResearchContentRef(this.draftId)) // double check
          .then((contentRef) => {
            const isProposal = !this.project.researchGroup.is_personal;

            researchContentService.createResearchContent(
              {
                privKey: this.$currentUser.privKey,
                username: this.$currentUser.username
              },
              isProposal,
              {
                researchExternalId: this.project.externalId,
                researchGroup: this.project.researchGroup.external_id,
                type: parseInt(this.formModel.contentType),
                title: this.formModel.title || contentRef.title,
                content: contentRef.hash,
                authors: this.formModel.authors.map((a) => a.account.name),
                references: [...this.formModel.references].map((ref) => ref.externalId),
                extensions: []
              }
            )
              .then(() => {
                this.$notifier.showSuccess('New material has been uploaded successfully');
                this.creteContentFinalize();
              })
              .catch((err) => {
                console.error(err);

                if (err.response && err.response.status === 409) {
                  this.$confirm(
                    'Please vote for existing proposal or propose file again if its existing proposal has expired.',
                    {
                      title: 'This file was already uploaded',
                      buttonFalseText: false
                    }
                  )
                    .then(() => {
                      this.creteContentFinalize();
                    });
                } else {
                  this.$notifier.showError('An error occurred while creating proposal, please try again later');
                }
              })
              .finally(() => {
                this.loadingPublish = false;
              });
          });
      },

      creteContentFinalize() {
        this.$router.push({
          name: 'project.details',
          params: {
            projectId: this.project.externalId
          }
        });
        this.$ls.remove(this.cache);
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
        z-index: 5 !important;
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

    .se-text {
      min-width: 0;

      a {
        word-break: break-all;
      }
    }

  }
</style>
