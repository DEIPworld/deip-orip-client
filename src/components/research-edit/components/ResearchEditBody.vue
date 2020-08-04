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

    <div v-if="tenant.profile.settings.researchCategories.length" class="my-6">
      <div class="text-h6 font-weight-medium pb-4">
        Category:
      </div>
      <v-select
        v-model="tenantCategory"
        :items="tenant.profile.settings.researchCategories"
        label="Category"
        outlined
        item-text="text"
        return-object
      />
    </div>

    <div class="my-6">
      <div class="text-h6 font-weight-medium pb-4">
        Video Presentation:
      </div>
      <v-text-field
        v-model="videoSrc"
        prepend-inner-icon="link"
        label="Link to a video presentation"
        single-line
        outlined
        :rules="[rules.link]"
      />
    </div>

    <v-divider />
    <div class="text-h6 font-weight-medium my-6">
      Research Criterials
    </div>

    <template v-for="(item, i) in tenant.profile.settings.researchComponents">
      <div v-if="item.isVisible" :key="`${i}-stepper`" class="my-6">
        <leveller-selector
          v-model.number="tenantCriterias[i].value.index"
          :items="stepperSelector(item.component.readinessLevels)"
          :label="item.component.readinessLevelTitle"
        />
      </div>
    </template>


    <v-divider class="mt-9" />

    <div class="my-6">
      <div class="text-h6 font-weight-medium pb-4">
        Partners
      </div>
      <research-partners :partners="partners" />
    </div>

    <v-divider />

    <div class="my-6">
      <div class="text-h6 font-weight-medium pb-4">
        Active Milestone:
      </div>
      <v-select
        v-model="activeMilestone"
        :items="milestones"
        label="Milestone"
        outlined
        item-text="goal"
        return-object
      />
    </div>

    <div v-if="milestones" class="py-6">
      <div class="text-h6 font-weight-medium pb-4">
        Roadmap:
      </div>
      <milestone-stepper :is-read-only="false" :steps="milestones" />
    </div>
    <div class="py-2 text-end">
      <v-btn
        class="my-0 ml-2"
        large
        :loading="isRefSaving"
        :disabled="isSavingRefDisabled || isRefSaving"
        color="primary"
        @click="updateResearchMetadata()"
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
            :src="$options.filters.researchBackgroundSrc(research.external_id, 300, 300)"
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
  import LevellerSelector from '@/components/Leveller/LevellerSelector';

  const accessService = AccessService.getInstance();
  const researchService = ResearchService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchEditBody',

    components: {
      ContentBlock,
      vueDropzone,
      LevellerSelector
    },
    data() {
      return {
        title: '',
        oldTitle: '',
        description: '',
        milestones: undefined,
        partners: [],
        tenantCategory: null,
        isPermlinkVerifyed: true,
        videoSrc: '',
        activeMilestone: undefined,
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
        tenantCriterias: []
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

      isSavingRefDisabled() {
        return !this.milestones
          || this.milestones.some((step) => !step.validation || step.validation.isValid === false)
          || !this.videoSrcIsValidOrAbsent
          || (this.partners.length ? this.partners.some((item) => item.title === '' || item.type === '') : false)
          || this.tenantCriterias.some(({ isVisible, value: { index } }) => (isVisible ? index === null : false));
      },

      isValidLink() {
        const regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
        return regexp.test(this.videoSrc || '');
      },

      videoSrcIsValidOrAbsent() {
        return !this.videoSrc || this.isValidLink;
      },

      researchGroup() {
        return this.userGroups.find((item) => item.id === this.research.research_group_id);
      }
    },

    created() {
      this.title = this.research.title;
      this.oldTitle = this.research.title;
      this.description = this.research.abstract;
      this.milestones = _.cloneDeep(this.researchRef.milestones);
      this.videoSrc = this.researchRef.videoSrc;
      this.tenantCategory = this.researchRef.tenantCategory || null;

      this.activeMilestone = this.milestones.find((m) => m.isActive);
      this.isPublic = !this.research.is_private;
      this.partners = this.researchRef.partners.map((item) => _.cloneDeep(item));

      this.tenantCriterias = this.$store.getters['auth/tenant'].profile.settings.researchComponents
        .map(({ _id, isVisible, component: componentSchema }) => {
          const tenantCriteria = this.researchRef.tenantCriterias.find((criteria) => criteria.component === _id);
          const enabledCriteria = { component: _id, isVisible, value: { index: tenantCriteria && tenantCriteria.value != null ? tenantCriteria.value.index : null } };

          if (componentSchema.readinessLevels[enabledCriteria.value.index]) { // check if a step is removed from the component after editing
            return enabledCriteria;
          } else {
            return { ...enabledCriteria, value: { index: null } };
          }
        });

      const milestones = this.milestones.map((m) => ({
        goal: m.goal,
        budget: m.budget,
        purpose: m.purpose,
        details: m.details,
        eta: moment(m.eta).toDate(),
        isActive: this.activeMilestone
          ? m.goal == this.activeMilestone.goal
          : false
      }));
    },
    methods: {
      stepperSelector(readinessLevels) {
        return readinessLevels.map((item, index) => ({
          text: item.title,
          value: index,
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

              const isProposal = !this.research.research_group.is_personal;
              researchService.updateResearchViaOffchain(this.user.privKey, isProposal, {
                researchGroup: this.research.research_group.external_id,
                externalId: this.research.external_id,
                title: this.title,
                abstract: this.description,
                isPrivate: !this.isPublic,
                reviewShare: undefined,
                compensationShare: undefined,
                members: undefined,
                extensions: []
              })
                .then(() => {
                  this.$notifier.showSuccess('Proposal has been sent successfully!')
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

                  this.$notifier.showError('An error occurred during proposal sending')
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

      updateResearchMetadata() {
        if (this.validateMilestones()) {
          this.isRefSaving = true;

          const milestones = this.milestones.map((m) => ({
            goal: m.goal,
            budget: m.budget,
            purpose: m.purpose,
            details: m.details,
            eta: moment(m.eta).toDate(),
            isActive: this.activeMilestone
              ? m.goal === this.activeMilestone.goal
              : false
          }));

          const tenantCriterias = this.tenantCriterias.map(criteria => {
            return criteria.value.index != null ? { ...criteria } : { ...criteria, value: null };
          });
          researchService.updateResearchOffchainMeta(this.research.external_id, {
            milestones,
            videoSrc: this.videoSrc,
            partners: this.partners,
            tenantCriterias,
            tenantCategory: this.tenantCategory
          })
            .then(() => {
              this.$notifier.showSuccess('Info has been change successfully!')
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
                  research_permlink: encodeURIComponent(this.research.permlink)
                }
              });
            })
            .catch((err) => {
              console.error(err);

              this.$notifier.showError('An error occurred during change info')
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
            research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
            research_permlink: encodeURIComponent(this.research.permlink)
          }
        });
      },

      validateMilestones() {
        const { milestones } = this;
        for (let index = 0; index < milestones.length; index++) {
          let isValid;
          const step = milestones[index];

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
        return milestones.every((step) => step.validation.isValid);
      },

      backgroundUploadSuccess(file, response) {
        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$notifier.showSuccess(`Background image has been updated successfully ! Refresh the page please`)
      },

      backgroundUploadError(file, message, xhr) {
        console.error(message);

        this.$refs.researchBackground.removeAllFiles();
        this.isUploadingBackground = false;
        this.$notifier.showError(`Sorry, an error occurred while uploading background image, please try again later`)
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
