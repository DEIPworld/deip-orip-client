<template>
  <content-block :max-width="800" centered>
    <div>
      <div class="text-h6 font-weight-medium pb-4">
        Tilte:
      </div>
      <v-text-field
        v-model="title"
        :rules="[rules.required, rules.titleLength]"
        name="title"
        outlined
        :error-messages="isPermlinkVerifyed === false ? 'Research with the same name already exists' : ''"
      />
    </div>
    <div>
      <div class="text-h6 font-weight-medium pb-4">
        Description:
      </div>
      <v-textarea
        v-model="description"
        :rules="[rules.required, rules.descriptionLength]"
        name="Description"
        outlined
        auto-grow
      />
    </div>
    <div class="mb-4">
      <div class="text-h6 font-weight-medium pb-4">
        Visibility
      </div>
      <div>
        <div class="display-inline-block" :class="{'grey--text':isPublic}">
          Private project
        </div>
        <div class="display-inline-block">
          <v-switch v-model="isPublic" class="my-0 ml-2 py-0" color="primary" />
        </div>
        <div class="display-inline-block" :class="{'grey--text':!isPublic}">
          Public project
        </div>
      </div>
    </div>
    <div class="py-2 mb-4 text-end">
      <v-btn
        class="my-0 ml-2"
        large
        :loading="isMetaSaving"
        :disabled="isSavingMetaDisabled || isMetaSaving"
        color="primary"
        @click="updateResearch()"
      >
        Update Research
      </v-btn>
    </div>
    <v-divider />

    <d-block title="Research attributes" small>
      <template
        v-for="(attribute, index) of tenant.profile.settings.researchAttributes.filter(({ isVisible }) => isVisible)">
        <attributes-set
          :key="`${index}-attr`"
          v-model="attributes[attribute._id]"
          :attribute-id="attribute._id"
        />
      </template>
    </d-block>

    <v-divider />

    <div class="py-2 text-end">
      <v-btn
        class="my-0 ml-2"
        large
        :loading="isRefSaving"
        :disabled="isRefSaving"
        color="primary"
        @click="updateResearch()"
      >
        Update Info
      </v-btn>
    </div>

    <div class="pb-4">
      <div class="text-h6 font-weight-medium pb-4">
        Background:
      </div>
      <v-row no-gutters>
        <v-col cols="3">
          <img
            class="ma-0"
            style="width: 150px; height: 150px"
            :src="research.external_id | researchBackgroundSrc(300, 300)"
          >
        </v-col>
        <v-col cols="9">
          <div v-if="backgroundDropzoneOptions">
            <vue-dropzone
              id="research-background-dropzone"
              ref="researchBackground"
              :options="backgroundDropzoneOptions"
              @vdropzone-success="backgroundUploadSuccess"
              @vdropzone-error="backgroundUploadError"
            />
            <div class="text-right py-4">
              <v-btn
                large
                :disabled="isUploadingBackground"
                :loading="isUploadingBackground"
                class="ma-0"
                color="primary"
                @click="updateBackgroundImage()"
              >
                Update image
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="pb-4">
      <v-btn
        class="ma-0"
        color="primary"
        outlined
        large
        @click="cancel()"
      >
        Back to project
      </v-btn>
    </div>
  </content-block>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Vue from 'vue';
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import vueDropzone from 'vue2-dropzone';
  import { maxTitleLength, maxDescriptionLength } from '@/variables';

  import { AccessService } from '@deip/access-service';
  import { ResearchService } from '@deip/research-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import AttributesSet from '@/components/Attributes/AttributesSet';

  const accessService = AccessService.getInstance();
  const researchService = ResearchService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchEditBody',

    components: {
      AttributesSet,
      DBlock,
      ContentBlock,
      vueDropzone
    },
    data() {
      return {
        title: '',
        oldTitle: '',
        description: '',
        isPermlinkVerifyed: true,
        isPublic: false,
        isRefSaving: false,
        isMetaSaving: false,
        isUploadingBackground: false,
        descriptionLength: 2048,
        rules: {
          required: (value) => !!value || 'This field is required',
          link: (value) => !value || this.isValidLink || 'Invalid http(s) link',
          titleLength: (value) => (!!value && value.length <= maxTitleLength) || `Title max length is ${maxTitleLength} symbols`,
          descriptionLength: (value) => (!!value && value.length <= maxDescriptionLength) || `Description max length is ${maxDescriptionLength} symbols`
        },
        attributes: {}
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        research: 're/research',
        researchRef: 're/researchRef',
        userGroups: 'auth/userGroups',
        tenant: 'auth/tenant'
      }),
      backgroundDropzoneOptions() {
        return this.research != null
          ? {
            url: `${window.env.DEIP_SERVER_URL}/api/research/background`,
            paramName: 'research-background',
            headers: {
              'Research-External-Id': this.research.external_id,
              Authorization: `Bearer ${accessService.getAccessToken()}`
            },
            maxFiles: 1,
            timeout: 0,
            uploadMultiple: false,
            createImageThumbnails: true,
            autoProcessQueue: false,
            dictDefaultMessage:
              '<i class=\'v-icon material-icons mb-2\' style=\'font-size:40px\'>backup</i><div class=\'mb-2\'>Drop files here to upload</div><div class=\'mb-2\'>or</div><button class=\'primary v-btn v-size--small mb-2\'>BROWSE</button><div>Background image should be at least 1440 x 430 px in dimension (.png)</div>',
            addRemoveLinks: true,
            acceptedFiles: ['image/png'].join(',')
          }
          : null;
      },

      isSavingMetaDisabled() {
        return !this.title || !this.description || this.title.length > maxTitleLength || this.description.length > maxDescriptionLength;
      },

      isValidLink() {
        const regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
        return regexp.test(this.videoSrc || '');
      },

      researchGroup() {
        return this.userGroups.find((item) => item.id === this.research.research_group_id);
      }
    },

    created() {
      this.title = this.research.title;
      this.oldTitle = this.research.title;
      this.description = this.research.abstract;

      this.isPublic = !this.research.is_private;

      this.attributes = {
        ...this.researchRef.attributes
          .reduce((a, attr) => ({ ...a, ...{ [attr.researchAttributeId]: attr.value } }), {})
      };

    },
    methods: {
      stepperSelector(options) {
        return options.map((item, index) => ({
          text: item.title,
          value: item.value,
          num: index + 1
        }));
      },

      updateResearch() {
        researchService.checkResearchExistenceByPermlink(this.research.research_group.external_id, this.title)
          .then((exists) => {
            if (this.oldTitle !== this.title) {
              this.isPermlinkVerifyed = !exists;
            } else {
              this.isPermlinkVerifyed = true;
            }
            if (this.isPermlinkVerifyed) {
              this.isMetaSaving = true;

              const attributes = Object.keys(this.attributes).map((a) => {
                return {
                  researchAttributeId: a,
                  value: this.attributes[a] || null
                }
              });

              const isProposal = !this.research.research_group.is_personal;
              researchService.updateResearchViaOffchain(this.user.privKey, isProposal, {
                research_group: this.research.research_group.external_id,
                external_id: this.research.external_id,
                title: this.title,
                abstract: this.description,
                is_private: !this.isPublic,
                review_share: undefined,
                compensation_share: undefined,
                members: undefined,
                extensions: []
              }, { attributes })
                .then(() => {
                  this.$notifier.showSuccess('Proposal has been sent successfully!');
                  if (this.researchGroup.is_centralized || this.researchGroup.is_personal) {
                    this.$router.push({
                      name: 'ResearchDetails',
                      params: {
                        research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
                        research_permlink: encodeURIComponent(this.research.permlink)
                      }
                    });
                  } else {
                    this.$router.push({
                      name: 'ResearchGroupDetails',
                      params: {
                        research_group_permlink: encodeURIComponent(this.research.research_group.permlink)
                      },
                      hash: '#proposals'
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);

                  this.$notifier.showError('An error occurred during proposal sending');
                })
                .finally(() => {
                  this.isMetaSaving = false;
                });
            }
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          });
      },

      updateBackgroundImage() {
        if (this.$refs.researchBackground.getQueuedFiles().length) {
          this.isUploadingBackground = true;
          this.$refs.researchBackground.processQueue();
        }
      },

      cancel() {
        this.$refs.researchBackground.removeAllFiles();
        this.$router.push({
          name: 'ResearchDetails',
          params: {
            research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
            research_permlink: encodeURIComponent(this.research.permlink)
          }
        });
      },

      backgroundUploadSuccess(file, response) {
        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$notifier.showSuccess('Background image has been updated successfully ! Refresh the page please');
      },

      backgroundUploadError(file, message, xhr) {
        console.error(message);

        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$notifier.showError('Sorry, an error occurred while uploading background image, please try again later');
      }
    }
  };
</script>

<style lang="less" scoped>
  #research-background-dropzone {
    background: #ebf5fe;
    color: #3067ff;
  }
</style>
