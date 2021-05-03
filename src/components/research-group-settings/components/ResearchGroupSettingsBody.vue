<template>
  <div>
    <v-form ref="form-data" class="mb-4">
      <d-form-block :title="$t('researchGroupSettings.dataForm.logoBlock.title')">
        <v-col>
          <v-avatar
            size="160px"
            class="group-image mb-6"
            @mouseover="onAvatarMouseOver"
            @mouseout="onAvatarMouseOut"
          >
            <img
              :src="$options.filters.researchGroupLogoSrc(group.external_id, 300, 300, true)"
            >
            <div v-if="logoDropzoneOptions">
              <vue-dropzone
                v-show="avatarUploadIsShown"
                id="image-dropzone"
                ref="researchGroupLogo"
                :options="logoDropzoneOptions"
                @vdropzone-success="logoUploadSuccess"
                @vdropzone-error="logoUploadError"
              />
            </div>
          </v-avatar>
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('researchGroupSettings.dataForm.nameBlock.title')">
        <v-col cols="12">
          <v-text-field
            v-model="newResearchGroupName"
            :rules="[rules.required, rules.titleLength]"
            :label="$t('researchGroupSettings.dataForm.nameBlock.nameField.label')"
            outlined
          />
        </v-col>
      </d-form-block>
      <d-form-block :title="$t('researchGroupSettings.dataForm.descBlock.title')">
        <v-col cols="12">
          <v-textarea
            v-model="newResearchGroupDescription"
            :rules="[rules.descriptionLength]"
            name="Description"
            :label="$t('researchGroupSettings.dataForm.nameBlock.descField')"
            outlined
            auto-grow
          />
        </v-col>
      </d-form-block>
      <div class="text-right">
        <slot name="buttons">
          <v-btn
            class="ma-0"
            color="primary"
            text
            large
            @click="cancel()"
          >
            {{ $t('researchGroupSettings.dataForm.cancel') }}
          </v-btn>
          <v-btn
            class="ml-2"
            large
            :loading="isLoading"
            :disabled="isLoading"
            color="primary"
            @click="save()"
          >
            {{ $t('researchGroupSettings.dataForm.submitBtn') }}
          </v-btn>
        </slot>
      </div>
    </v-form>
    <!-- <v-form v-if="group.is_dao" ref="form-quorum" class="mb-4">
      <d-form-block :title="$t('researchGroupSettings.quorumForm.quorumBlock.title')">
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
              {{ $t('researchGroupSettings.quorumForm.text') }}
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
            $t('researchGroupSettings.quorumForm.submitBtn')
          </v-btn>
        </slot>
      </div>
    </v-form> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import {
    maxTitleLength, maxDescriptionLength, PROPOSAL_TYPES, proposalTypesLabels
  } from '@/variables';

  import { AccessService } from '@deip/access-service';
  import { ResearchGroupService } from '@deip/research-group-service';

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
        avatarUploadIsShown: false,
        isLoading: false,
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
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          titleLength: (value) => value.length <= maxTitleLength || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength }),
          descriptionLength: (value) => value.length <= maxDescriptionLength || this.$t('defaultNaming.fieldRules.descriptionMax', { maxDescriptionLength })
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
              Authorization: `Bearer ${accessService.getAccessToken()}`
            },
            timeout: 0,
            maxFiles: 1,
            uploadMultiple: false,
            autoProcessQueue: false,
            previewsContainer: false,
            dictDefaultMessage:
              "<i class='v-icon material-icons theme--dark mb-n10' style='font-size:40px'>camera_alt</i>",
            addRemoveLinks: false,
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

      isSaveAvailable() {
        return (
          (this.newResearchGroupName !== this.groupName
            || this.newResearchGroupDescription !== this.groupDescription)
          && this.newResearchGroupName !== ''
          && this.newResearchGroupName.length < maxTitleLength
          && this.newResearchGroupDescription.length < maxDescriptionLength
        );
      }
    },
    created() {
      this.fillValues();
    },
    methods: {
      onAvatarMouseOver() {
        this.avatarUploadIsShown = true;
      },
      onAvatarMouseOut() {
        this.avatarUploadIsShown = false;
      },
      cancel(proposal = false) {
        this.$refs.researchGroupLogo.removeAllFiles(this.group.external_id);
        this.$router.push({
          name: 'team.details',
          params: {
            teamId: this.group.external_id
          },
          // hash: proposal ? '#proposals' : ''
        });
      },
      logoUploadSuccess(file, response) {
        if (this.isSaveAvailable) {
          this.updateResearchGroup();
        } else {
          this.$refs.researchGroupLogo.removeAllFiles();
          this.isLoading = false;
          this.$notifier.showSuccess(this.$t('researchGroupSettings.dataForm.successLogo'));
          this.cancel();
        }
      },
      logoUploadError(file, message, xhr) {
        this.$refs.researchGroupLogo.removeAllFiles();
        this.isLoading = false;
        this.$notifier.showError(this.$t('researchGroupSettings.dataForm.errLogo'));
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


      save() {
        if (this.$refs.researchGroupLogo.getQueuedFiles().length) {
          this.isLoading = true;
          this.$refs.researchGroupLogo.processQueue();
        } else if (this.isSaveAvailable) {
          this.updateResearchGroup();
        }
      },
      updateResearchGroup() {
        if (this.newResearchGroupName !== this.groupName) {
          this.isLoading = true;

          const isProposal = !this.group.is_personal;
          researchGroupService.updateResearchGroupAccount(
            { privKey: this.user.privKey, username: this.user.username }, 
            isProposal, 
            {
              researchGroup: this.group.external_id,
              accountOwnerAuth: undefined,
              accountActiveAuth: undefined,
              accountActiveAuthOverrides: undefined,
              accountMemoPubKey: undefined,
              accountJsonMetadata: undefined,
              accountExtensions: []
            },
            {
              researchGroupName: this.newResearchGroupName,
              researchGroupDescription: this.newResearchGroupDescription
            }
          )
            .then(() => {
              this.$notifier.showSuccess(this.$t('researchGroupSettings.dataForm.successProposal'));
              this.cancel(isProposal);
            })
            .catch((err) => {
              console.error(err);

              this.$notifier.showError(this.$t('researchGroupSettings.dataForm.errProposal'));
            })
            .finally(() => {
              this.isLoading = false;
              this.cancel();
            });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .group-image {
      position: relative
  }

  #image-dropzone {
    background: #9e978e;
    background-color: rgba(29, 32, 34, .7);
    display: inline-block;
    position: absolute;
    // height: 80px;
    // width: 160px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border: 0.5px solid rgba(29, 32, 34, 0.7);
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    min-height: 0 !important;
  }
</style>
