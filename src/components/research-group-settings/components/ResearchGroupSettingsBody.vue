<template>
  <div>
    <v-form ref="form-data" class="mb-4">
      <d-form-block title="Group name">
        <v-col cols="12">
          <v-text-field
            v-model="newResearchGroupName"
            :rules="[rules.required]"
            label="Name"
            filled
          />
        </v-col>
      </d-form-block>
      <d-form-block title="Group description:">
        <v-col cols="12">
          <v-textarea
            v-model="newResearchGroupDescription"
            :rules="[rules.required]"
            name="Description"
            label="Description"
            filled
            auto-grow
          />
        </v-col>
      </d-form-block>
      <div class="text-right">
        <slot name="buttons">
          <v-btn
            class="ma-0"
            large
            :loading="isChangingMetaLoading"
            :disabled="!isDisabledBtnNameDescription || isChangingMetaLoading"
            color="primary"
            @click="updateResearchGroup()"
          >
            Update Name and Description
          </v-btn>
        </slot>
      </div>
    </v-form>
    <!-- <v-form v-if="group.is_dao" ref="form-quorum" class="mb-4">
      <d-form-block title="Quorum threshold:">
        <v-col cols="12">
          <div class="pt-4">
            <div v-for="(proposalBlock, i) in proposalOrderMap" :key="`proposalBlock-${i}`">
              <div
                v-for="proposalData in proposalBlock"
                :key="proposalLabels[proposalData.key]"
              >
                <div class="display-flex">
                  <div
                    class="grow font-weight-medium align-self-center"
                  >
                    {{ proposalLabels[proposalData.key] }}
                  </div>
                  <div class="shrink align-self-center">
                    <v-text-field
                      v-model="proposalData.value"
                      class="percent-input"
                      mask="###"
                      suffix="%"
                      hide-details
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              class="pt-2 caption line-height-1 text-align-right primary--text text--lighten-3"
            >
              The proposal will be sent to group members and after it's approved the threshold will be changed
            </div>
          </div>
        </v-col>
      </d-form-block>
      <div class="text-right">
        <slot name="buttons">
          <v-btn
            class="ma-0"
            large
            :loading="isChangingQuorumLoading"
            :disabled="isDisabledBtnQuorum || isChangingQuorumLoading"
            color="primary"
            @click=""
          >
            Update Quorum
          </v-btn>
        </slot>
      </div>
    </v-form> -->
    <v-form v-if="isResearchGroupMember" ref="form-image">
      <d-form-block title="Update group logo:">
        <v-col cols="3">
          <img
            width="150px"
            height="150px"
            :src="$options.filters.researchGroupLogoSrc(group.external_id, 300, 300, true)"
          >
        </v-col>
        <v-col cols="9">
          <div v-if="logoDropzoneOptions">
            <vue-dropzone
              id="research-group-logo"
              ref="researchGroupLogo"
              :options="logoDropzoneOptions"
              @vdropzone-success="logoUploadSuccess"
              @vdropzone-error="logoUploadError"
            />
          </div>
        </v-col>
      </d-form-block>
      <div class="text-right">
        <slot name="buttons">
          <v-btn
            :disabled="isUploadingLogo"
            :loading="isUploadingLogo"
            large
            class="ma-0"
            color="primary"
            @click="updateLogoImage()"
          >
            Update logo
          </v-btn>
        </slot>
      </div>
    </v-form>

    <div>
      <v-btn
        class="ma-0"
        color="primary"
        outlined
        large
        @click="cancel()"
      >
        Back to group
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';

  import { AccessService } from '@deip/access-service';
  import { ResearchGroupService } from '@deip/research-group-service';

  import { PROPOSAL_TYPES, proposalTypesLabels } from '@/variables';

  const accessService = AccessService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchGroupSettingsBody',

    components: {
      vueDropzone,
      DFormBlock
    },
    data() {
      return {
        isChangingMetaLoading: false,
        isChangingQuorumLoading: false,
        groupName: '',
        groupDescription: '',
        proposalLabels: _.cloneDeep(proposalTypesLabels),

        proposalOrderMap: [
          [
            { key: PROPOSAL_TYPES.CREATE_RESEARCH, value: undefined },
            { key: PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.INVITE_MEMBER, value: undefined },
            { key: PROPOSAL_TYPES.EXCLUDE_MEMBER, value: undefined }
          ],
          [
            { key: PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE, value: undefined },
            { key: PROPOSAL_TYPES.TRANSFER, value: undefined }
          ],
          [
            {
              key: PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP,
              value: undefined
            },
            {
              key: PROPOSAL_TYPES.UPDATE_RESEARCH,
              value: undefined
            }
          ]
        ],

        newResearchGroupName: '',
        newResearchGroupDescription: '',
        shadowProposalOrderMap: undefined,
        isUploadingLogo: false,
        rules: {
          required: (value) => !!value || 'This field is required'
        }
      };
    },
    computed: {
      ...mapGetters({
        group: 'researchGroupSettings/group',
        user: 'auth/user'
      }),
      logoDropzoneOptions() {
        return this.group != null
          ? {
            url: `${window.env.DEIP_SERVER_URL}/api/groups/logo`,
            paramName: 'research-background',
            headers: {
              'Research-Group-External-Id': this.group.external_id,
              'Authorization': `Bearer ${accessService.getAccessToken()}`
            },
            timeout: 0,
            maxFiles: 1,
            uploadMultiple: false,
            createImageThumbnails: true,
            autoProcessQueue: false,
            dictDefaultMessage:
              "<i class='v-icon material-icons' style='font-size:40px'>backup</i><p>Research group logo (.png)</p>",
            addRemoveLinks: true,
            acceptedFiles: ['image/png'].join(',')
          }
          : null;
      },
      isResearchGroupMember() {
        return this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false;
      },

      isDisabledBtnQuorum() {
        return (
          _.isEqual(this.proposalOrderMap, this.shadowProposalOrderMap)
          || _.some(this.proposalOrderMap, (proposalBlock) => _.some(proposalBlock, (proposalData) => {
            const intValue = parseInt(proposalData.value);
            const isNumber = _.isFinite(intValue);

            return !isNumber || (isNumber && (intValue > 100 || intValue < 1));
          }))
        );
      },

      isDisabledBtnNameDescription() {
        return (
          (this.newResearchGroupName !== this.groupName
          || this.newResearchGroupDescription !== this.groupDescription)
          && this.newResearchGroupName !== ''
          && this.newResearchGroupDescription !== ''
        );
      }
    },
    created() {
      this.fillValues();
    },
    methods: {
      cancel(proposal = false) {
        this.$refs.researchGroupLogo.removeAllFiles();
        this.$router.push({
          name: 'ResearchGroupDetails',
          params: {
            research_group_permlink: encodeURIComponent(this.group.permlink)
          },
          hash: proposal ? '#proposals' : ''
        });
      },
      logoUploadSuccess(file, response) {
        this.$refs.researchGroupLogo.removeAllFiles();
        this.isUploadingLogo = false;
        this.$notifier.showSuccess(`Logo has been updated successfully ! Refresh the page please`)
      },
      logoUploadError(file, message, xhr) {
        // console.log(message);
        this.$refs.researchGroupLogo.removeAllFiles();
        this.isUploadingLogo = false;
        this.$notifier.showError(`Sorry, an error occurred while uploading logo image, please try again later`)
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
        if (this.group.is_dao) {
          this.proposalOrderMap.forEach((proposalsBlock) => {
            proposalsBlock.forEach((proposalData) => {
              const intValue = this.convertToPercent(
                this.DEIP_100_PERCENT
              );
              proposalData.value = intValue.toString(); // input works with string values
            });
          });
        }
        this.shadowProposalOrderMap = _.cloneDeep(this.proposalOrderMap);
        this.newResearchGroupName = this.groupName;
        this.newResearchGroupDescription = this.groupDescription;
      },

      // sendChangeQuorumProposal() {
      //   this.isChangingQuorumLoading = true;
      //   const promises = [];

      //   this.proposalOrderMap.forEach((proposalBlock, i) => {
      //     proposalBlock.forEach((proposalData, j) => {
      //       if (proposalData.value !== this.shadowProposalOrderMap[i][j].value) {
      //         const promise = researchGroupService.createChangeQuorumProposal({
      //           groupId: this.group.id,
      //           action: proposalData.key,
      //           quorum: this.toDeipPercent(proposalData.value)
      //         });

      //         promises.push(promise);
      //       }
      //     });
      //   });

      //   Promise.all(promises)
      //     .then(() => {
      //       this.$store.dispatch('layout/setSuccess', {
      //         message: 'Proposal has been sent successfully!'
      //       });
      //       this.cancel(true);
      //     })
      //     .catch((err) => {
      //       console.log(err);

      //       this.$store.dispatch('layout/setError', {
      //         message: 'An error occurred during proposal sending'
      //       });
      //     })
      //     .finally(() => {
      //       this.isChangingQuorumLoading = false;
      //     });
      // },


      updateResearchGroup() {
        this.isChangingMetaLoading = true;

        const isProposal = !this.group.is_personal;
        researchGroupService.updateResearchGroupAccountViaOffchain(this.user.privKey, isProposal, {
          researchGroup: this.group.external_id,
          accountOwnerAuth: undefined,
          accountActiveAuth: undefined,
          accountPostingAuth: undefined,
          accountMemoPubKey: undefined,
          accountJsonMetadata: undefined,
          accountExtensions: []
        }, {
          researchGroupName: this.newResearchGroupName,
          researchGroupDescription: this.newResearchGroupDescription,
          researchGroupThresholdOverrides: []
        })
          .then(() => {
            this.$notifier.showSuccess('Proposal has been sent successfully!')
            this.cancel(true);
          })
          .catch((err) => {
            console.log(err);

            this.$notifier.showError('An error occurred during proposal sending')
          })
          .finally(() => {
            this.isChangingMetaLoading = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
#research-group-logo {
  background: #ebf5fe;
  color: #3067ff;
}
</style>
