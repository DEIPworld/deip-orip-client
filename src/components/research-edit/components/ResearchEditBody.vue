<template>
  <v-card height="100%">
    <v-layout row wrap justify-center style="flex: 0 0 auto;" class="px-4 py-5 full-width">
      <v-flex xs10>
        <v-layout column>
          <div>
            <div class="title half-bold pb-3">Tilte:</div>
            <v-text-field v-model="title" :rules="[rules.required]" name="title" label="Title" solo></v-text-field>
          </div>

          <div>
            <div class="title half-bold pb-3">Description:</div>
            <v-textarea
              v-model="description"
              :rules="[rules.required]"
              name="Description"
              label="Description"
              solo
              auto-grow
            ></v-textarea>
          </div>

          <div>
            <div class="title half-bold pb-3">Video Presentation:</div>
            <v-text-field
              prepend-inner-icon="link"
              label="Link to a video presentation"
              single-line
              solo
              v-model="videoSrc"
              :rules="[rules.link]"
            ></v-text-field>
          </div>

          <div>
            <div class="title half-bold pb-3">Active Milestone:</div>
            <v-select
              v-model="activeMilestone"
              :items="milestones"
              label="Milestone"
              solo
              item-text="goal"
              return-object
            ></v-select>
          </div>

          <div v-if="milestones" class="py-4">
            <div class="title half-bold pb-3">Roadmap:</div>
            <milestone-stepper :isReadOnly="false" :steps="milestones"></milestone-stepper>
          </div>

          <div class="py-2">
            <v-layout justify-end>
              <v-btn
                class="my-0 ml-2"
                large
                :loading="isLoading"
                :disabled="isSavingDisabled || isLoading"
                color="primary"
                @click="save()"
              >Update Info</v-btn>
            </v-layout>
          </div>

          <div class="pb-3">
            <div class="title half-bold pb-3">Background:</div>
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
                  ></vue-dropzone>
                  <div class="text-xs-right py-3">
                    <v-btn
                      large
                      :disabled="isUploadingBackground"
                      :loading="isUploadingBackground"
                      class="ma-0"
                      color="primary"
                      @click="updateBackgroundImage()"
                    >Update image</v-btn>
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
import { mapGetters } from "vuex";
import Vue from "vue";
import _ from "lodash";
import deipRpc from "@deip/deip-oa-rpc-client";
import moment from "moment";
import { getAccessToken } from "./../../../utils/auth";
import vueDropzone from "vue2-dropzone";
import * as proposalService from "./../../../services/ProposalService";

export default {
  name: "ResearchEditBody",
  components: {
    vueDropzone
  },
  data() {
    return {
      title: "",
      description: "",
      milestones: undefined,
      videoSrc: "",
      activeMilestone: undefined,
      isLoading: false,
      isUploadingBackground: false,
      rules: {
        required: value => !!value || "This field is required",
        link: value => {
          return !value || this.isValidLink || "Invalid http(s) link";
        }
      },
      shadowMetaData: undefined
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      research: "re/research",
      userGroups: "auth/userGroups"
    }),

    backgroundDropzoneOptions() {
      return this.research != null
        ? {
            url: `${window.env.DEIP_SERVER_URL}/api/research/background`,
            paramName: "research-background",
            headers: {
              "Research-Id": this.research.id.toString(),
              Authorization: "Bearer " + getAccessToken()
            },
            timeout: 0,
            uploadMultiple: false,
            createImageThumbnails: true,
            autoProcessQueue: false,
            dictDefaultMessage:
              "<i class='v-icon material-icons' style='font-size:40px'>backup</i><p>Background image should be at least 1440 x 430 px in dimension (.png)</p>",
            addRemoveLinks: true,
            acceptedFiles: ["image/png"].join(",")
          }
        : null;
    },

    metaData() {
      let milestones = this.milestones.map(m => {
        return {
          goal: m.goal,
          details: m.details,
          eta: moment(m.eta).toDate(),
          is_active: this.activeMilestone
            ? m.goal == this.activeMilestone.goal
            : false
        };
      });
      return JSON.stringify({
        title: this.title,
        description: this.description,
        milestones,
        video_src: this.videoSrc,
        is_tokenized: this.$options.filters.researchTokenized(
          this.research.abstract
        )
      });
    },

    isSavingDisabled() {
      return (
        !this.title ||
        !this.description ||
        !this.milestones ||
        this.milestones.some(
          step => !step.validation || step.validation.isValid === false
        ) ||
        !this.videoSrcIsValidOrAbsent ||
        _.isEqual(this.shadowMetaData, this.metaData)
      );
    },

    isValidLink() {
      let regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
      return regexp.test(this.videoSrc || "");
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
    save() {
      if (this.validateMilestones()) {
        this.isLoading = true;

        let description = this.description;
        let milestones = this.milestones.map(m => {
          return {
            goal: m.goal,
            details: m.details,
            eta: moment(m.eta).toDate(),
            is_active: this.activeMilestone
              ? m.goal == this.activeMilestone.goal
              : false
          };
        });

        let abstract = JSON.stringify({
          description,
          milestones,
          video_src: this.videoSrc,
          is_tokenized: this.$options.filters.researchTokenized(
            this.research.abstract
          )
        });

        if (this.researchGroup.is_personal || !this.researchGroup.is_dao) {
          deipRpc.broadcast
            .researchUpdateAsync(
              this.user.privKey,
              this.research.id,
              this.title,
              abstract,
              this.research.permlink,
              this.user.username
            )
            .then(
              () => {
                this.$store.dispatch("layout/setSuccess", {
                  message: "Research has been updated successfully!"
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "ResearchDetails",
                    params: {
                      research_group_permlink: encodeURIComponent(
                        this.research.group_permlink
                      ),
                      research_permlink: encodeURIComponent(
                        this.research.permlink
                      )
                    }
                  });
                  this.isLoading = false;
                }, 1500);
              },
              err => {
                console.log(err);
                this.$store.dispatch("layout/setError", {
                  message:
                    "An error occurred while updating research, please try again later"
                });
                this.isLoading = false;
              }
            );
        } else {
          const researchIds = {
            id: this.research.id,
            researchGroupId: this.research.research_group_id
          };

          const promise = proposalService.createChangeResearchNameAndDescriptionProposal(
            researchIds,
            this.title,
            abstract
          );

          promise
            .then(() => {
              this.$store.dispatch("layout/setSuccess", {
                message: "Proposal has been sent successfully!"
              });
              this.$router.push({
                name: "ResearchGroupDetails",
                params: {
                  research_group_permlink: encodeURIComponent(
                    this.research.group_permlink
                  )
                },
                hash: "#proposals"
              });
            })
            .catch(err => {
              console.log(err);

              this.$store.dispatch("layout/setError", {
                message: "An error occurred during proposal sending"
              });
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
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
        name: "ResearchDetails",
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

        if (step.goal == "") {
          isValid = false;
          Vue.set(
            step.validation,
            "goalError",
            index === milestones.length - 1
              ? "Research should have the primary Goal"
              : "Step Goal is required"
          );
        }
        if (!step.eta /* || moment(step.eta).diff(moment(), 'days') < 0 */) {
          isValid = false;
          Vue.set(
            step.validation,
            "etaError",
            step.eta == ""
              ? "Goal deadline should be specified"
              : "Goal deadline can not be in the Past"
          );
        }

        Vue.set(step.validation, "isValid", isValid !== false);
      }
      return milestones.every(step => step.validation.isValid);
    },

    backgroundUploadSuccess(file, response) {
      this.$refs.researchBackground.removeAllFiles();
      this.isUploadingBackground = false;
      this.$store.dispatch("layout/setSuccess", {
        message:
          "Background image has been updated successfully ! Refresh the page please"
      });
    },

    backgroundUploadError(file, message, xhr) {
      console.log(message);
      this.$refs.researchBackground.removeAllFiles();
      this.isUploadingBackground = false;
      this.$store.dispatch("layout/setError", {
        message:
          "Sorry, an error occurred while uploading background image, please try again later"
      });
    }
  },

  created() {
    this.title = this.research.title;
    this.description = this.$options.filters.researchAbstract(
      this.research.abstract
    );
    this.milestones = this.$options.filters.researchMilestones(
      this.research.abstract
    );
    this.videoSrc = this.$options.filters.researchVideoSrc(
      this.research.abstract
    );
    this.activeMilestone = this.milestones.find(m => m.is_active);

    let milestones = this.milestones.map(m => {
      return {
        goal: m.goal,
        details: m.details,
        eta: moment(m.eta).toDate(),
        is_active: this.activeMilestone
          ? m.goal == this.activeMilestone.goal
          : false
      };
    });
    this.shadowMetaData = JSON.stringify({
      title: this.title,
      description: this.description,
      milestones,
      video_src: this.videoSrc,
      is_tokenized: this.$options.filters.researchTokenized(
        this.research.abstract
      )
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