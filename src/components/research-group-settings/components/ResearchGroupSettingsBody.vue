<template>
  <v-card height="100%">
    <v-layout row wrap justify-center style="flex: 0 0 auto;" class="px-4 py-5 full-width">
      <v-flex xs10>
        <v-layout column>
          <div>
            <div class="title font-weight-medium pb-3">Group name:</div>
            <v-text-field
              v-model="newResearchGroupName"
              :rules="[rules.required]"
              label="Name"
              solo
            />
          </div>
          <div>
            <div class="title font-weight-medium pb-3">Group description:</div>
            <v-textarea
              v-model="newResearchGroupDescription"
              :rules="[rules.required]"
              name="Description"
              label="Description"
              solo
              auto-grow
            ></v-textarea>
          </div>
          <div class="py-2 pt-3">
            <v-layout justify-end>
              <v-btn
                class="ma-0"
                large
                :loading="isLoading"
                :disabled="!isDisabledBtnNameDescription || isLoading"
                color="primary"
                @click="sendChangeNameAndDescProposal()"
              >Update Name and Description</v-btn>
            </v-layout>
          </div>
          <!-- <v-layout row justify-center> -->
          <!-- <v-flex xs12 lg8> -->
          <div>
            <div class="title font-weight-medium pb-3">Quorum threshold:</div>
            <div class="pt-3">
              <div>
                <div class="pt-3">
                  <div
                    v-for="(proposalBlock, i) in proposalOrderMap" :key="`proposalBlock-${i}`">
                    <div
                      v-for="proposalData in proposalBlock"
                      :key="proposalLabels[proposalData.key]"
                    >
                      <v-layout row>
                        <v-flex
                          grow
                          font-weight-medium
                          align-self-center
                        >{{ proposalLabels[proposalData.key] }}</v-flex>
                        <v-flex shrink align-self-center>
                          <v-text-field
                            class="percent-input"
                            v-model="proposalData.value"
                            mask="###"
                            suffix="%"
                            hide-details
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                  </div>

                  <div
                    class="pt-2 caption line-height-1 text-align-right primary--text text--lighten-3"
                  >The proposal will be sent to group members and after it's approved the threshold will be changed</div>
                </div>
              </div>
            </div>
          </div>
          <!-- </v-flex> -->
          <!-- </v-layout> -->

          <div class="py-2 pt-3">
            <v-layout justify-end>
              <v-btn
                class="ma-0"
                large
                :loading="isLoading"
                :disabled="isDisabledBtnQuorum || isLoading"
                color="primary"
                @click="sendChangeQuorumProposal()"
              >Update Quorum</v-btn>
            </v-layout>
          </div>

          <div>
            <div class="py-4" v-if="isResearchGroupMember">
              <div class="title font-weight-medium pb-4">Update group logo:</div>
              <v-layout>
                <v-flex xs3>
                  <img
                    width="150px"
                    height="150px"
                    :src="$options.filters.researchGroupLogoSrc(group.id, 300, 300, true)"
                  />
                </v-flex>
                <v-flex xs9>
                  <div v-if="logoDropzoneOptions">
                    <vue-dropzone
                      ref="researchGroupLogo"
                      id="research-group-logo"
                      :options="logoDropzoneOptions"
                      @vdropzone-success="logoUploadSuccess"
                      @vdropzone-error="logoUploadError"
                    ></vue-dropzone>
                    <div class="text-xs-right py-3">
                      <v-btn
                        :disabled="isUploadingLogo"
                        :loading="isUploadingLogo"
                        large
                        class="ma-0"
                        @click="updateLogoImage()"
                        color="primary"
                      >Update logo</v-btn>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </div>

          <div class="pb-3">
            <v-btn class="ma-0" color="primary" outline large @click="cancel()">Back to group</v-btn>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import deipRpc from "@deip/deip-oa-rpc-client";

import { mapGetters } from "vuex";
import { getAccessToken } from "./../../../utils/auth";
import vueDropzone from "vue2-dropzone";
import * as proposalService from "./../../../services/ProposalService";

export default {
  name: "ResearchGroupSettingsBody",
  components: {
    vueDropzone
  },
  data() {
    return {
      isLoading: false,
      groupName: "",
      groupDescription: "",
      proposalLabels: _.cloneDeep(proposalService.labels),

      proposalOrderMap: [
        [
          { key: proposalService.types.START_RESEARCH, value: undefined },
          {
            key: proposalService.types.CREATE_RESEARCH_MATERIAL,
            value: undefined
          },
          {
            key: proposalService.types.CHANGE_RESEARCH_REVIEW_SHARE_PERCENT,
            value: undefined
          }
        ],
        [
          { key: proposalService.types.INVITE_MEMBER, value: undefined },
          { key: proposalService.types.DROPOUT_MEMBER, value: undefined }
        ],
        [
          {
            key: proposalService.types.START_RESEARCH_TOKEN_SALE,
            value: undefined
          },
          {
            key: proposalService.types.OFFER_RESEARCH_TOKENS,
            value: undefined
          },
          { key: proposalService.types.SEND_FUNDS, value: undefined }
        ],
        [
          { key: proposalService.types.CHANGE_QUORUM, value: undefined },
          {
            key: proposalService.types.REBALANCE_RESEARCH_GROUP_TOKENS,
            value: undefined
          }
        ],
        [
          {
            key: proposalService.types.CHANGE_RESEARCH_GROUP_META_DATA_TYPE,
            value: undefined
          },
          {
            key: proposalService.types.CHANGE_RESEARCH_META_DATA_TYPE,
            value: undefined
          }
        ]
      ],

      newResearchGroupName: "",
      newResearchGroupDescription: "",
      shadowProposalOrderMap: undefined,
      isUploadingLogo: false,
      rules: {
        required: value => !!value || "This field is required"
      }
    };
  },
  computed: {
    ...mapGetters({
      group: "researchGroupSettings/group"
    }),
    logoDropzoneOptions() {
      return this.group != null
        ? {
            url: `${window.env.DEIP_SERVER_URL}/api/groups/logo`,
            paramName: "research-background",
            headers: {
              "Research-Group-Id": this.group.id.toString(),
              Authorization: "Bearer " + getAccessToken()
            },
            timeout: 0,
            uploadMultiple: false,
            createImageThumbnails: true,
            autoProcessQueue: false,
            dictDefaultMessage:
              "<i class='v-icon material-icons' style='font-size:40px'>backup</i><p>Research group logo (.png)</p>",
            addRemoveLinks: true,
            acceptedFiles: ["image/png"].join(",")
          }
        : null;
    },
    isResearchGroupMember() {
      return this.group != null
        ? this.$store.getters["auth/userIsResearchGroupMember"](this.group.id)
        : false;
    },

    isDisabledBtnQuorum() {
      return (
        _.isEqual(this.proposalOrderMap, this.shadowProposalOrderMap) ||
        _.some(this.proposalOrderMap, proposalBlock =>
          _.some(proposalBlock, proposalData =>
            proposalService.validateQuorumValue(proposalData.value)
          )
        )
      );
    },

    isDisabledBtnNameDescription() {
      return (
        (this.newResearchGroupName !== this.groupName ||
          this.newResearchGroupDescription !== this.groupDescription) &&
        this.newResearchGroupName !== "" &&
        this.newResearchGroupDescription !== ""
      );
    }
  },
  methods: {
    cancel(proposal = false) {
      this.$refs.researchGroupLogo.removeAllFiles();
      this.$router.push({
        name: "ResearchGroupDetails",
        params: {
          research_group_permlink: encodeURIComponent(this.group.permlink)
        },
        hash: proposal ? "#proposals" : ""
      });
    },
    logoUploadSuccess(file, response) {
      this.$refs.researchGroupLogo.removeAllFiles();
      this.isUploadingLogo = false;
      this.$store.dispatch("layout/setSuccess", {
        message: "Logo has been updated successfully ! Refresh the page please"
      });
    },
    logoUploadError(file, message, xhr) {
      // console.log(message);
      this.$refs.researchGroupLogo.removeAllFiles();
      this.isUploadingLogo = false;
      this.$store.dispatch("layout/setError", {
        message:
          "Sorry, an error occurred while uploading logo image, please try again later"
      });
    },
    updateLogoImage() {
      if (this.$refs.researchGroupLogo.getQueuedFiles().length) {
        this.isUploadingLogo = true;
        this.$refs.researchGroupLogo.processQueue();
      }
    },
    fillValues() {
      this.groupName = this.group.name;
      this.groupDescription = this.group.description;
      this.proposalOrderMap.forEach(proposalsBlock => {
        proposalsBlock.forEach(proposalData => {
          const intValue = this.convertToPercent(
            this.group.proposal_quorums[proposalData.key - 1][1]
          );
          proposalData.value = intValue.toString(); // input works with string values
        });
      });

      this.shadowProposalOrderMap = _.cloneDeep(this.proposalOrderMap);
      this.newResearchGroupName = this.groupName;
      this.newResearchGroupDescription = this.groupDescription;
    },

    sendChangeQuorumProposal() {
      this.isLoading = true;
      const promises = [];

      this.proposalOrderMap.forEach((proposalBlock, i) => {
        proposalBlock.forEach((proposalData, j) => {
          if (proposalData.value !== this.shadowProposalOrderMap[i][j].value) {
            const promise = proposalService.createChangeQuorumProposal(
              this.group.id,
              proposalData.key,
              this.toDeipPercent(proposalData.value)
            );

            promises.push(promise);
          }
        });
      });

      Promise.all(promises)
        .then(() => {
          this.$store.dispatch("layout/setSuccess", {
            message: "Proposal has been sent successfully!"
          });
          this.cancel(true);
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
    },

    sendChangeNameAndDescProposal() {
      this.isLoading = true;

      const promise = proposalService.createChangeGroupNameAndDescriptionProposal(
        this.group.id,
        this.newResearchGroupName,
        this.newResearchGroupDescription
      );
      promise
        .then(() => {
          this.$store.dispatch("layout/setSuccess", {
            message: "Proposal has been sent successfully!"
          });
          this.cancel(true);
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
  },
  created() {
    this.fillValues();
  }
};
</script>

<style lang="less" scoped>
#research-group-logo {
  background: #ebf5fe;
  color: #3067ff;
}
</style>