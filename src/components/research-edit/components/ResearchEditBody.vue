<template>
  <v-card height="100%">
    <v-layout row wrap justify-center style="flex: 0 0 auto;" class="px-4 py-5 full-width">
      <v-flex xs10>
        <v-layout column>
          <div>
            <div class="title font-weight-medium pb-3">Tilte:</div>
            <v-text-field
              v-model="title"
              :rules="[rules.required]"
              name="title"
              label="Title"
              solo
            />
          </div>
          <div>
            <div class="title font-weight-medium pb-3">Description:</div>
            <v-textarea
              v-model="description"
              :rules="[rules.required]"
              name="Description"
              label="Description"
              solo
              auto-grow
            />
          </div>
          <div class="mb-3">
            <div class="title font-weight-medium pb-3">Visibility</div>
            <v-layout row shrink>
              <v-flex shrink :class="{'grey--text':isPublic}">Private project</v-flex>
              <v-flex shrink>
                <v-switch class="my-0 ml-2 py-0" v-model="isPublic" color="primary" />
              </v-flex>
              <v-flex shrink :class="{'grey--text':!isPublic}">Public project</v-flex>
            </v-layout>
          </div>
          <div class="py-2 mb-3">
            <v-layout justify-end>
              <v-btn
                class="my-0 ml-2"
                large
                :loading="isMetaSaving"
                :disabled="isSavingMetaDisabled || isMetaSaving"
                color="primary"
                @click="saveMeta()"
              >
                Update Info
              </v-btn>
            </v-layout>
          </div>
          <v-divider />

          <div class="my-4">
            <div class="title font-weight-medium pb-3">Video Presentation:</div>
            <v-text-field
              v-model="videoSrc"
              prepend-inner-icon="link"
              label="Link to a video presentation"
              single-line
              solo
              :rules="[rules.link]"
            />
          </div>

          <v-divider />

          <div class="my-4">
            <div class="title font-weight-medium pb-3">Technology Readiness Level</div>
            <technology-readiness-level
              :currentTrlStep="currentTrlStep"
              @changeCurrentTrlStep="changeCurrentTrlStep"
            />
          </div>

          <v-divider />

          <div class="my-4">
            <div class="title font-weight-medium pb-3">Partners</div>
            <research-partners :partners="partners" />
          </div>

          <v-divider />

          <div class="my-4">
            <div class="title font-weight-medium pb-3">Active Milestone:</div>
            <v-select
              v-model="activeMilestone"
              :items="milestones"
              label="Milestone"
              solo
              item-text="goal"
              return-object
            />
          </div>

          <div v-if="milestones" class="py-4">
            <div class="title font-weight-medium pb-3">Roadmap:</div>
            <milestone-stepper :is-read-only="false" :steps="milestones" />
          </div>

          <div class="py-2">
            <v-layout justify-end>
              <v-btn
                class="my-0 ml-2"
                large
                :loading="isRefSaving"
                :disabled="isSavingRefDisabled || isRefSaving"
                color="primary"
                @click="saveRef()"
              >
                Update Info
              </v-btn>
            </v-layout>
          </div>

          <div class="pb-3">
            <div class="title font-weight-medium pb-3">Background:</div>
            <v-layout>
              <v-flex xs3>
                <img
                  class="ma-0"
                  style="width: 150px; height: 150px"
                  :src="$options.filters.researchBackgroundSrc(research.id, 300, 300)"
                />
              </v-flex>
              <v-flex xs9>
                <div v-if="backgroundDropzoneOptions">
                  <vue-dropzone
                    ref="researchBackground"
                    id="research-background-dropzone"
                    :options="backgroundDropzoneOptions"
                    @vdropzone-success="backgroundUploadSuccess"
                    @vdropzone-error="backgroundUploadError"
                  />
                  <div class="text-xs-right py-3">
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
              </v-flex>
            </v-layout>
          </div>

          <div class="pb-3">
            <v-btn class="ma-0" color="primary" outline large @click="cancel()">Back to research</v-btn>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Vue from 'vue';
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import vueDropzone from 'vue2-dropzone';

  import { AccessService } from '@deip/access-service';
  import { ResearchService } from '@deip/research-service';
  import { ResearchGroupService } from '@deip/research-group-service';

  const accessService = AccessService.getInstance();
  const researchService = ResearchService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchEditBody',

    components: {
      vueDropzone
    },
    data() {
      return {
        title: '',
        description: '',
        milestones: undefined,
        currentTrlStep: undefined,
        partners: [],
        videoSrc: '',
        activeMilestone: undefined,
        isPublic: false,
        isRefSaving: false,
        isMetaSaving: false,
        isUploadingBackground: false,
        rules: {
          required: value => !!value || 'This field is required',
          link: value => {
            return !value || this.isValidLink || 'Invalid http(s) link';
          }
        },
        shadowMetaData: undefined,
        shadowRefData: undefined
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        research: 're/research',
        researchRef: 're/researchRef',
        userGroups: 'auth/userGroups'
      }),

      backgroundDropzoneOptions() {
        return this.research != null
          ? {
            url: `${window.env.DEIP_SERVER_URL}/api/research/background`,
            paramName: 'research-background',
            headers: {
              'Research-Id': this.research.id.toString(),
              Authorization: 'Bearer ' + accessService.getAccessToken()
            },
            timeout: 0,
            uploadMultiple: false,
            createImageThumbnails: true,
            autoProcessQueue: false,
            dictDefaultMessage:
              '<i class=\'v-icon material-icons\' style=\'font-size:40px\'>backup</i><p>Background image should be at least 1440 x 430 px in dimension (.png)</p>',
            addRemoveLinks: true,
            acceptedFiles: [ 'image/png' ].join(',')
          }
          : null;
      },

      metaData() {
        return JSON.stringify({
          title: this.title,
          description: this.description,
          is_private: !this.isPublic
        });
      },

      refData() {
        let milestones = this.milestones.map(m => {
          return {
            goal: m.goal,
            budget: m.budget,
            purpose: m.purpose,
            details: m.details,
            eta: moment(m.eta).toDate(),
            isActive: this.activeMilestone
              ? m.goal === this.activeMilestone.goal
              : false
          };
        });
        return JSON.stringify({
          milestones,
          video_src: this.videoSrc,
          currentTrlStep: this.currentTrlStep,
          partners: this.partners
        });
      },

      isSavingMetaDisabled() {
        return (
          !this.title ||
          !this.description ||
          _.isEqual(this.shadowMetaData, this.metaData)
        );
      },

      isSavingRefDisabled() {
        return !this.milestones
          || this.milestones.some(
            (step) => !step.validation || step.validation.isValid === false
          )
          || !this.videoSrcIsValidOrAbsent
          || _.isEqual(this.shadowRefData, this.refData)
          || (this.partners.length
            ? !!this.partners.find((item) => item.title === '' || item.type === '')
            : false);
      },

      isValidLink() {
        let regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
        return regexp.test(this.videoSrc || '');
      },

      videoSrcIsValidOrAbsent() {
        return !this.videoSrc || this.isValidLink;
      },

      researchGroup() {
        return this.userGroups.find(
          item => item.id === this.research.research_group_id
        );
      }
    },
    methods: {
      saveMeta() {
        this.isMetaSaving = true;

        const promise = researchGroupService.createChangeResearchNameAndDescriptionProposal({
          researchId: this.research.id,
          researchGroupId: this.research.research_group_id,
          newResearchTitle: this.title,
          newResearchAbstract: this.description,
          isPrivate: !this.isPublic
        });

        promise
          .then(() => {
            this.$store.dispatch('layout/setSuccess', {
              message: 'Proposal has been sent successfully!'
            });
            if (this.researchGroup.is_centralized || this.researchGroup.is_personal) {
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(
                    this.research.group_permlink
                  ),
                  research_permlink: encodeURIComponent(this.research.permlink)
                }
              });
            } else {
              this.$router.push({
                name: 'ResearchGroupDetails',
                params: {
                  research_group_permlink: encodeURIComponent(
                    this.research.group_permlink
                  )
                },
                hash: '#proposals'
              });
            }
          })
          .catch(err => {
            console.log(err);

            this.$store.dispatch('layout/setError', {
              message: 'An error occurred during proposal sending'
            });
          })
          .finally(() => {
            this.isMetaSaving = false;
          });
      },

      saveRef() {
        if (this.validateMilestones()) {
          this.isRefSaving = true;

          let milestones = this.milestones.map(m => {
            return {
              goal: m.goal,
              budget: m.budget,
              purpose: m.purpose,
              details: m.details,
              eta: moment(m.eta).toDate(),
              isActive: this.activeMilestone
                ? m.goal === this.activeMilestone.goal
                : false

            };
          });

          researchService.updateResearch(
            this.research.id,
            milestones,
            this.videoSrc,
            this.partners,
            this.currentTrlStep
          )
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: 'Info has been change successfully!'
              });
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(
                    this.research.group_permlink
                  ),
                  research_permlink: encodeURIComponent(this.research.permlink)
                }
              });
            })
            .catch(err => {
              console.log(err);

              this.$store.dispatch('layout/setError', {
                message: 'An error occurred during change info'
              });
            })
            .finally(() => {
              this.isRefSaving = false;
            });
        }
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
            research_group_permlink: encodeURIComponent(
              this.research.group_permlink
            ),
            research_permlink: encodeURIComponent(this.research.permlink)
          }
        });
      },

      validateMilestones() {
        let milestones = this.milestones;
        for (let index = 0; index < milestones.length; index++) {
          let isValid = undefined;
          let step = milestones[index];

          if (step.goal == '') {
            isValid = false;
            Vue.set(
              step.validation,
              'goalError',
              index === milestones.length - 1
                ? 'Research should have the primary Goal'
                : 'Step Goal is required'
            );
          }
          if (step.budget == '') {
            isValid = false;
            Vue.set(
              step.validation,
              'budgetError',
              index === milestones.length - 1
                ? 'Research should have the estimated budget'
                : 'Step budget is required'
            );
          }
          if (step.purpose == '') {
            isValid = false;
            Vue.set(
              step.validation,
              'purposeError',
              index === milestones.length - 1
                ? 'Research should have the budget purpose'
                : 'Step purpose is required'
            );
          }
          if (!step.eta /* || moment(step.eta).diff(moment(), 'days') < 0 */) {
            isValid = false;
            Vue.set(
              step.validation,
              'etaError',
              step.eta == ''
                ? 'Goal deadline should be specified'
                : 'Goal deadline can not be in the Past'
            );
          }

          Vue.set(step.validation, 'isValid', isValid !== false);
        }
        return milestones.every(step => step.validation.isValid);
      },

      backgroundUploadSuccess(file, response) {
        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$store.dispatch('layout/setSuccess', {
          message:
            'Background image has been updated successfully ! Refresh the page please'
        });
      },

      backgroundUploadError(file, message, xhr) {
        console.log(message);
        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$store.dispatch('layout/setError', {
          message:
            'Sorry, an error occurred while uploading background image, please try again later'
        });
      },

      changeCurrentTrlStep(step) {
        this.currentTrlStep = step;
      }
    },

    created() {
      this.title = this.research.title;
      this.description = this.research.abstract;
      this.milestones = _.cloneDeep(this.researchRef.milestones)
      this.videoSrc = this.researchRef.videoSrc;

      this.activeMilestone = this.milestones.find(m => m.isActive);
      this.isPublic = !this.research.is_private;
      this.currentTrlStep = this.researchRef.trl;
      this.partners = this.researchRef.partners.map(item => _.cloneDeep(item));

      let milestones = this.milestones.map(m => {
        return {
          goal: m.goal,
          budget: m.budget,
          purpose: m.purpose,
          details: m.details,
          eta: moment(m.eta).toDate(),
          isActive: this.activeMilestone
            ? m.goal == this.activeMilestone.goal
            : false
        };
      });

      this.shadowMetaData = JSON.stringify({
        title: this.title,
        description: this.description,
        is_private: !this.isPublic
      });
      this.shadowRefData = JSON.stringify({
        milestones,
        video_src: this.videoSrc,
        currentTrlStep: this.currentTrlStep,
        partners: this.partners
      });
    }
  };
</script>

<style lang="less" scoped>
  #research-background-dropzone {
    background: #ebf5fe;
    color: #3067ff;
  }
</style>
