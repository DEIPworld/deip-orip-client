<template>
  <div>
    <div>
      <div v-if="dropzoneOptions">
        <vue-dropzone
          id="content-dropzone"
          ref="newContent"
          :options="dropzoneOptions"
          @vdropzone-sending-multiple="vdropzoneSendingMultiple"
          @vdropzone-file-added="vdropzoneFileAdded"
          @vdropzone-success-multiple="vdropzoneSuccessMultiple"
          @vdropzone-error-multiple="vdropzoneErrorMultiple"
        />
      </div>
    </div>
    <v-dialog
      v-if="research"
      v-model="isOpen"
      persistent
      transition="scale-transition"
      max-width="600px"
    >
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
          <div v-if="research.members.length">
            <v-text-field
              v-model="title"
              outlined
              :rules="[rules.titleLength]"
              :label="$t('contents.contentUploadDialog.titleField.label')"
              :error-messages="isPermlinkVerifyed === false ?
                $t('contents.contentUploadDialog.titleField.err') :
                ''
              "
            />

            <v-select
              v-model="type"
              :items="researchContentTypes"
              outlined
              :label="$t('contents.contentUploadDialog.typeField')"
              item-value="id"
            />

            <user-selector
              v-model="authors"
              :users="research.members"
              :label="$t('contents.contentUploadDialog.authorsAttribute')"
              multiple
              class="mb-4"
            />

            <internal-references-picker
              :show-selected="true"
              :current-research="research"
              :preselected="references"
              :all-references-list="allReferencesList"
              @referenceAdded="addReference"
              @referenceRemoved="removeReference"
            />
          </div>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row no-gutters>
            <v-col class="py-2" cols="12">
              <v-btn
                color="primary"
                block
                :disabled="isDisabled || isLoading"
                :loading="isLoading"
                @click="proposeContent()"
              >
                {{ !isCentralizedGroup ?
                  $t('contents.contentUploadDialog.createProp') :
                  $t('contents.contentUploadDialog.uploadMat')
                }}
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
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';
  import { researchContentTypes, maxTitleLength } from '@/variables';

  import { AccessService } from '@deip/access-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchContentService } from '@deip/research-content-service';
  import { SearchService } from '@deip/search-service';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  const searchService = SearchService.getInstance();
  const accessService = AccessService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ContentUploadDialog',

    components: {
      UserSelector,
      vueDropzone
    },

    data() {
      return {
        title: '',
        type: null,
        authors: [],
        researchContentTypes,
        references: [],
        allReferencesList: [],
        isPermlinkVerifyed: true,

        isOpen: false,
        isLoading: false,

        rules: {
          titleLength: (value) => value.length <= maxTitleLength || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength })
        },

        dropzoneOptions: {
          url: `${window.env.DEIP_SERVER_URL}/content/upload-files`,
          paramName: 'research-content',
          timeout: 0,
          maxFiles: 10,
          parallelUploads: 10, // important to keep the same as maxFiles due to server session
          uploadMultiple: true,
          thumbnailWidth: 150,
          autoProcessQueue: false,
          addRemoveLinks: true
          // acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
        }
      };
    },
    computed: {
      ...mapGetters({
        research: 'Project/data'
      }),

      isCentralizedGroup() {
        return this.research.researchGroup.is_centralized || this.research.researchGroup.is_personal;
      },
      isDisabled() {
        return !this.title
          || this.title.length > maxTitleLength
          || !this.type
          || !this.authors.length;
      }
    },
    watch: {
      isOpen(newVal, oldVal) {
        if (newVal) {
          this.title = '';
          this.type = null;
          this.timestamp = (new Date()).getTime();
          this.authors = [];
        }
      }
    },

    created() {
      searchService.getAllResearchContents()
        .then((contents) => {
          this.allReferencesList.push(...contents);
        });
    },

    methods: {
      isAuthorSelected(item) {
        return this.authors.find((author) => author.account.name == item.account.name) !== undefined;
      },
      close() {
        this.isLoading = false;
        this.$refs.newContent.removeAllFiles();
        this.isOpen = false;
      },
      proposeContent() {
        researchContentService.checkResearchContentExistenceByPermlink(this.research.externalId, this.title)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            if (this.isPermlinkVerifyed) {
              this.isLoading = true;
              this.$refs.newContent.processQueue();
            }
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          });
      },
      vdropzoneSendingMultiple(file, xhr, formData) {
        const accessToken = accessService.getAccessToken();
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Upload-Session', `${(new Date()).getTime()}-${accessToken.split('.')[2]}`);
        // TODO: add as formParam after upgrading back-end
        xhr.setRequestHeader('Research-External-Id', this.research.externalId);
        xhr.setRequestHeader('Project-ContentDetails-References', this.references.map((ref) => ref.external_id));
      },
      vdropzoneErrorMultiple(files, message, xhr) {
        this.$notifier.showError(this.$t('contents.contentUploadDialog.errFile'));
        this.close();
      },
      vdropzoneFileAdded(file) {
        this.isOpen = true;
      },
      vdropzoneSuccessMultiple(files, res) {
        const self = this;
        const { rm: { hash } } = res;
        if (!hash) {
          throw new Error(this.$t('contents.contentUploadDialog.errFileUpload'));
        }

        const isProposal = !this.research.researchGroup.is_personal;
        researchContentService.createResearchContentViaOffchain(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.account.name },
          false,
          {
            researchExternalId: this.research.externalId,
            researchGroup: this.research.researchGroup.external_id,
            type: parseInt(this.type),
            title: this.title,
            content: hash,
            authors: this.authors,
            references: this.references.map((ref) => ref.external_id),
            extensions: []
          }
        )
          .then(() => {
            this.$notifier.showSuccess(this.$t('contents.contentUploadDialog.success'));
          }, (err) => {
            console.error(err);
            if (err.response && err.response.status == 409) {
              alert(this.$t('contents.contentUploadDialog.fileUploaded'));
            } else {
              this.$notifier.showError(this.$t('contents.contentUploadDialog.errUploadingContent'));
            }
          })
          .finally(() => {
            this.$emit('onFinish');
            this.references = [];
            this.close();
          });
      },

      addReference(ref) {
        if (!this.references.some((r) => r.external_id == ref.external_id)) {
          this.references.push(ref);
        }
      },
      removeReference(ref) {
        if (this.references.some((r) => r.external_id == ref.external_id)) {
          this.references = this.references.filter((r) => r.external_id != ref.external_id);
        }
      }
    }
  };
</script>

<style lang="less" scoped>

  #content-dropzone {
    margin-left: -1px;
    margin-right: -1px;
  }

  .author-item {
    width: 100%
  }

  .selected-author-item {
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: rgb(224, 224, 224);
  }

  .avatar {
    margin-left: 10px
  }

</style>
