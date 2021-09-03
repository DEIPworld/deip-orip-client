<template>
  <div>
    <v-btn
      block
      outlined
      color="primary"
      @click="open()"
    >
      Upload content
    </v-btn>
    <v-dialog
      v-if="research"
      v-model="isOpen"
      persistent
      transition="scale-transition"
      max-width="600px"
    >
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card class="pa-6">
          <v-card-title>
            <div class="text-h5">
              {{ $t('contents.contentUploadDialog.upload') }}
            </div>
            <div class="right-top-angle">
              <v-btn icon class="pa-0 ma-0" @click="close()">
                <v-icon color="black">
                  close
                </v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  outlined
                  :rules="[rules.titleLength]"
                  :label="$t('contents.contentUploadDialog.titleField.label')"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="formData.type"
                  :items="projectContentTypes"
                  outlined
                  :label="$t('contents.contentUploadDialog.typeField')"
                  item-value="id"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12">
                <user-selector
                  v-model="formData.authors"
                  :users="research.members"
                  :label="$t('contents.contentUploadDialog.authorsAttribute')"
                  multiple
                />
              </v-col>

              <v-col cols="12">
                <references-selector
                  v-model="formData.references"
                  :label="$t('contents.contentUploadDialog.addRef')"
                  multiple
                />
              </v-col>

              <v-col cols="12">
                <d-file-input
                  v-model="formData.files"
                  multiple
                  :label="'Attach files'"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6">
            <v-row no-gutters>
              <v-col class="py-2" cols="12">
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  :disabled="isDisabled || isLoading"
                  :loading="isLoading"
                >
                  {{ $t('contents.contentUploadDialog.uploadMat') }}
                </v-btn>
              </v-col>
              <v-col class="py-2" cols="12">
                <v-btn
                  :disabled="isLoading"
                  color="primary"
                  block
                  text
                  @click="close()"
                >
                  {{ $t('contents.contentUploadDialog.cancel') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { ProjectContentService } from '@deip/project-content-service';
  import { projectContentTypes, maxTitleLength } from '@/variables';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';
  import ReferencesSelector from '@/features/References/components/Selector/ReferencesSelector';
  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';

  const projectContentService = ProjectContentService.getInstance();

  export default {
    name: 'ContentUploadDialog',

    components: {
      ReferencesSelector,
      UserSelector,
      DFileInput,
      DFormBlock
    },

    data() {
      return {

        formData: {
          title: '',
          type: 0,
          authors: [],
          references: [],
          files: []
        },

        projectContentTypes,

        isOpen: false,
        isLoading: false,

        rules: {
          titleLength: (value) => value.length <= maxTitleLength || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength })
        }
      };
    },
    computed: {
      ...mapGetters({
        research: 'Project/projectDetails'
      }),
      isDisabled() {
        return !this.formData.title
          || this.formData.title.length > maxTitleLength
          || !this.formData.type
          || !this.formData.authors.length
          || !this.formData.files.length;
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        if (newVal) {
          this.formData.title = '';
          this.formData.type = 0;
          this.formData.authors = [];
          this.formData.references = [];
          this.formData.files = [];
        }
      }
    },

    methods: {
      open() {
        this.isOpen = true;
        this.isLoading = false;
      },
      close() {
        this.isOpen = false;
        this.isLoading = false;
      },

      onSubmit() {
        this.publishResearchContentPackage();
      },

      publishResearchContentPackage() {
        const filesData = {};
        for (let i = 0; i < this.formData.files.length; i++) {
          filesData[`file-${i + 1}`] = this.formData.files[i];
        }

        this.isLoading = true;
        return projectContentService.createProjectContentDraft({
          projectId: this.research.externalId,
          title: this.formData.title,
          type: parseInt(this.formData.type),
          authors: this.formData.authors,
          references: this.formData.references,
          draftType: 'package',
          ...filesData // files
        })
          .then(({ _id: draftId }) => {
            setTimeout(() => {
              projectContentService.getDraft(draftId)
                .then((draft) => {
                  if (draft) {
                    const isProposal = !this.research.researchGroup.is_personal;
                    projectContentService.createProjectContent(
                      {
                        initiator: {
                          privKey: this.$currentUser.privKey,
                          username: this.$currentUser.username
                        },
                        proposalInfo: { isProposal },
                        projectId: this.research.externalId,
                        teamId: this.research.researchGroup.external_id,
                        type: parseInt(this.formData.type),
                        title: this.formData.title,
                        content: draft._id,
                        authors: this.formData.authors,
                        references: this.formData.references
                      }
                    )
                      .then(() => {
                        this.$notifier.showSuccess(this.$t('contents.contentUploadDialog.success'));
                      })
                      .catch((err) => {
                        console.error(err);
                        if (err.response && err.response.status == 409) {
                          alert(this.$t('contents.contentUploadDialog.fileUploaded'));
                        } else {
                          this.$notifier.showError(this.$t('contents.contentUploadDialog.errUploadingContent'));
                        }
                      })
                      .finally(() => {
                        this.$emit('onFinish');
                        this.close();
                      });
                  } else {
                    this.close();
                  }
                });
            }, 10000);
          });
      }
    }
  };
</script>
