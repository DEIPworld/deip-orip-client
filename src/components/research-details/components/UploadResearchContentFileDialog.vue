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
          <div class="headline">
            Upload material for research
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
          <div v-if="researchGroupMembersList.length">
            <v-text-field
              v-model="title"
              label="Title"
              hide-details
            />

            <v-select
              v-model="type"
              :items="researchContentTypes"
              label="Content Type"
              class="c-mt-6"
              item-value="id"
            />

            <v-autocomplete
              v-model="authors"
              :items="researchGroupMembersList"
              :menu-props="{ closeOnContentClick: true }"
              hint="You can select multiple authors"
              persistent-hint
              placeholder="Authors"
              multiple
            >
              <template slot="selection" slot-scope="data">
                <div class="legacy-row-nowrap align-center c-pl-4">
                  <v-avatar size="30px">
                    <img v-if="data.item.profile" :src="data.item.profile | avatarSrc(60, 60, false)">
                    <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                  </v-avatar>
                  <span class="c-pl-3">{{ data.item | fullname }}</span>
                </div>
              </template>

              <template slot="item" slot-scope="data">
                <template>
                  <div
                    class="legacy-row-nowrap align-center author-item"
                    :class="{ 'selected-author-item': isAuthorSelected(data.item) }"
                  >
                    <v-avatar size="30px">
                      <img v-if="data.item.profile" :src="data.item.profile | avatarSrc(60, 60, false)">
                      <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                    </v-avatar>
                    <span class="c-pl-3">{{ data.item | fullname }}</span>
                  </div>
                </template>
              </template>
            </v-autocomplete>

            <internal-references-picker
              :show-selected="true"
              :current-research="research"
              :preselected="[]"
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
  import { researchContentTypes } from '@/variables';

  import { AccessService } from '@deip/access-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchContentService } from '@deip/research-content-service';

  const accessService = AccessService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'UploadResearchContentFileDialog',

    components: {
      vueDropzone
    },

    data() {
      return {
        title: '',
        type: null,
        authors: [],
        researchContentTypes,
        references: [],

        isOpen: false,
        isLoading: false,

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
        user: 'auth/user',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        researchGroup: 'rd/group',
        userPersonalGroup: 'auth/userPersonalGroup'
      }),
      isCentralizedGroup() {
        return this.researchGroup.is_centralized || this.researchGroup.is_personal;
      },
      isDisabled() {
        return !this.title
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
        this.isLoading = true;
        this.$refs.newContent.processQueue();
      },
      vdropzoneSendingMultiple(file, xhr, formData) {
        const accessToken = accessService.getAccessToken();
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Upload-Session', `${(new Date()).getTime()}-${accessToken.split('.')[2]}`);
        // TODO: add as formParam after upgrading back-end
        xhr.setRequestHeader('Research-External-Id', this.research.external_id);
        xhr.setRequestHeader('Research-Content-References', this.references.map((ref) => ref.external_id));
      },
      vdropzoneErrorMultiple(files, message, xhr) {
        this.$notifier.show(`Sorry, the file storage server is temporarily unavailable, please try again later`, 'error')
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

        const isProposal = !this.research.research_group.is_personal;
        researchContentService.createResearchContentViaOffchain(this.user.privKey, isProposal, {
          researchExternalId: this.research.external_id,
          researchGroup: this.research.research_group.external_id,
          type: parseInt(this.type),
          title: this.title,
          content: hash,
          authors: this.authors.map((a) => a.account.name),
          references: this.references.map((ref) => ref.external_id),
          foreignReferences: [],
          extensions: []
        })
          .then(() => {
            this.$notifier.show('New material has been uploaded successfully', 'success')
          }, (err) => {
            console.log(err);
            if (err.response && err.response.status == 409) {
              alert('This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.');
            } else {
              this.$notifier.show('An error occurred while uploading content, please try again later', 'error')
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
