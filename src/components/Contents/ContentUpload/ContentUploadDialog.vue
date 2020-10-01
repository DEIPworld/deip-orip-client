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
            Upload material for project
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
              label="Title"
              :error-messages="isPermlinkVerifyed === false ? 'ContentDetails with the same name already exists' : ''"
            />

            <v-select
              v-model="type"
              :items="researchContentTypes"
              outlined
              label="Content Type"
              item-value="id"
            />

            <attributes-users-list-set
              v-model="authors"
              :users="research.members"
              :attribute="{title: 'Authors'}"
            />

<!--            <v-autocomplete-->
<!--              v-model="authors"-->
<!--              :items="research.members"-->
<!--              :menu-props="{ closeOnContentClick: true }"-->
<!--              hint="You can select multiple authors"-->
<!--              persistent-hint-->
<!--              outlined-->
<!--              placeholder="Authors"-->
<!--              class="mb-3"-->
<!--              multiple-->
<!--            >-->
<!--              <template slot="selection" slot-scope="data">-->
<!--                <div class="legacy-row-nowrap align-center c-pl-4">-->
<!--                  <v-avatar size="30px">-->
<!--                    <img v-if="data.item.profile" :src="data.item.profile | avatarSrc(60, 60, false)">-->
<!--                    <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />-->
<!--                  </v-avatar>-->
<!--                  <span class="c-pl-3">{{ data.item | fullname }}</span>-->
<!--                </div>-->
<!--              </template>-->

<!--              <template slot="item" slot-scope="data">-->
<!--                <template>-->
<!--                  <div-->
<!--                    class="legacy-row-nowrap align-center author-item"-->
<!--                    :class="{ 'selected-author-item': isAuthorSelected(data.item) }"-->
<!--                  >-->
<!--                    <v-avatar size="30px">-->
<!--                      <img v-if="data.item.profile" :src="data.item.profile | avatarSrc(60, 60, false)">-->
<!--                      <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />-->
<!--                    </v-avatar>-->
<!--                    <span class="c-pl-3">{{ data.item | fullname }}</span>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </template>-->
<!--            </v-autocomplete>-->

            <internal-references-picker
              :show-selected="true"
              :current-research="research"
              :preselected="[]"
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
                {{ !isCentralizedGroup ? 'Create Proposal' : 'Upload Material' }}
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
                Cancel
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
  import AttributesUsersListSet from '@/components/Attributes/AttributesUsersList/AttributesUsersListSet';

  const searchService = SearchService.getInstance();
  const accessService = AccessService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ContentUploadDialog',

    components: {
      AttributesUsersListSet,
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
          titleLength: (value) => value.length <= maxTitleLength || `Title max length is ${maxTitleLength} symbols`
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
        research: 'Research/data',
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
        researchContentService.checkResearchContentExistenceByPermlink(this.research.external_id, this.title)
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
        xhr.setRequestHeader('Research-External-Id', this.research.external_id);
        xhr.setRequestHeader('Research-ContentDetails-References', this.references.map((ref) => ref.external_id));
      },
      vdropzoneErrorMultiple(files, message, xhr) {
        this.$notifier.showError('Sorry, the file storage server is temporarily unavailable, please try again later');
        this.close();
      },
      vdropzoneFileAdded(file) {
        this.isOpen = true;
      },
      vdropzoneSuccessMultiple(files, res) {
        const self = this;
        const { rm: { hash } } = res;
        if (!hash) {
          throw new Error('File upload has failed');
        }

        const isProposal = !this.research.researchGroup.is_personal;
        researchContentService.createResearchContentViaOffchain(this.$currentUser.privKey, isProposal, {
          researchExternalId: this.research.external_id,
          researchGroup: this.research.researchGroup.external_id,
          type: parseInt(this.type),
          title: this.title,
          content: hash,
          authors: this.authors,
          references: this.references.map((ref) => ref.external_id),
          extensions: []
        })
          .then(() => {
            this.$notifier.showSuccess('New material has been uploaded successfully');
          }, (err) => {
            console.error(err);
            if (err.response && err.response.status == 409) {
              alert('This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.');
            } else {
              this.$notifier.showError('An error occurred while uploading content, please try again later');
            }
          })
          .finally(() => {
            this.$emit('onFinish');
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
