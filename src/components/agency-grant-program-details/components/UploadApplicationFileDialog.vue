<template>
  <v-dialog
    v-model="meta.isOpen"
    fullscreen
    persistent
    transition="scale-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Application</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <div class="fill-height pa-12 xs12">
        <div v-if="researchList">
          <div class="mb-4 display-flex">
            <div class="pr-4">
              Funding opportunity:
            </div>
            <div class="a text-subtitle-1">
              {{ program.additional_info.funding_opportunity_title }}
            </div>
          </div>
          <v-divider />
          <v-autocomplete
            v-model="research"
            class="mt-4"
            outlined
            :items="researchList"
            :filter="researchFilter"
            label="Research"
          >
            <template v-slot:selection="data">
              <div>
                <span>{{ data.item.title }}</span>
              </div>
            </template>
            <template v-slot:item="data">
              <template>
                <div class="author-item">
                  <span class="pl-4">{{ data.item.title }}</span>
                </div>
              </template>
            </template>
          </v-autocomplete>
          <div v-if="research">
            <div class="pt-4 pb-4">
              <div class="text-h6">
                <span class="font-weight-medium">Research group:</span>
                <router-link
                  class="a"
                  :to="{
                    name: 'research.details',
                    params: {
                      researchExternalId: research.external_id
                    }
                  }"
                >
                  {{ research.group.name }}
                </router-link>
              </div>
              <div class="pt-4 display-flex">
                <div
                  v-for="(member, i) in research.group.enrichedMembers"
                  :key="i"
                  class="pt-2 pr-4 flex"
                >
                  <platform-avatar
                    :user="member"
                    :size="40"
                    link-to-profile
                    link-to-profile-class="px-1"
                  />
                </div>
              </div>
            </div>
            <v-divider />
            <div class="py-2">
              <v-row class="justify-center">
                <v-col cols="6" class="pr-4">
                  <v-text-field
                    v-model="title"
                    class=""
                    outlined
                    label="Title"
                    :rules="[
                      applicationTitleRule
                    ]"
                  />
                </v-col>
                <v-col cols="6" class="pl-4">
                  <v-text-field
                    v-model="totalAmount"
                    class=""
                    outlined
                    label="Total amount"
                    suffix="$"
                    :rules="[
                      applicationTotalAmountRule
                    ]"
                  />
                </v-col>
              </v-row>
              <div>
                <v-text-field
                  v-model="organization"
                  class=""
                  outlined
                  label="Organization"
                />
              </div>
            </div>
            <div v-if="dropzoneOptions">
              <div>
                <vue-dropzone
                  id="application-dropzone"
                  ref="newApplication"
                  :options="dropzoneOptions"
                  @vdropzone-file-added="vdropzoneFileAdded"
                  @vdropzone-removed-file="vdropzoneRemovedFile"
                  @vdropzone-error="vdropzoneError"
                  @vdropzone-success-multiple="vsuccessMultiple"
                />
              </div>
            </div>
            <div>
              <div class="mb-2">
                <div class="display-flex align-center">
                  <div class="font-weight-bold pr-4">
                    Application
                  </div>
                  <div class="font-weight-medium primary--text">
                    Application content
                  </div>
                  <v-icon v-show="filesMap['Application Content.pdf']" color="green" class="pl-4">
                    check_circle
                  </v-icon>
                </div>
              </div>
              <div>
                <v-row no-gutters>
                  <v-col cols="6">
                    <div class="font-weight-bold">
                      Mandatory forms
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        SF424 (R &amp; R) [V2.0]
                      </div>
                      <v-icon v-show="filesMap['RR_SF424_2_0-V2.0.pdf']" color="green" class="pl-4">
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        PHS 398 Cover Page Supplement [V4.0]
                      </div>
                      <v-icon
                        v-show="filesMap['PHS398_CoverPageSupplement_4_0-V4.0.pdf']"
                        color="green"
                        class="pl-4"
                      >
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        Research And Related Other Project Information [V1.4]
                      </div>
                      <v-icon v-show="filesMap['RR_OtherProjectInfo_1_4-V1.4.pdf']" color="green" class="pl-4">
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        Project/Performance Site Location(s) [V2.0]
                      </div>
                      <v-icon v-show="filesMap['PerformanceSite_2_0-V2.0.pdf']" color="green" class="pl-4">
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        Research and Related Senior/Key Person Profile (Expanded)
                        [V2.0]
                      </div>
                      <v-icon v-show="filesMap['RR_KeyPersonExpanded_2_0-V2.0.pdf']" color="green" class="pl-4">
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        PHS 398 Research Plan [V4.0]
                      </div>
                      <v-icon v-show="filesMap['PHS398_ResearchPlan_4_0-V4.0.pdf']" color="green" class="pl-4">
                        check_circle
                      </v-icon>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        PHS Human Subjects and Clinical Trials Information [V1.0]
                      </div>
                      <v-icon
                        v-show="filesMap['PHSHumanSubjectsAndClinicalTrialsInfo-V1.0.pdf']"
                        color="green"
                        class="pl-4"
                      >
                        check_circle
                      </v-icon>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="font-weight-bold">
                      Optional forms
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        Research &amp; Related Budget [V1.4]
                      </div>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        R &amp; R Subaward Budget Attachment(s) Form 5 YR 30 ATT
                        [V1.4]
                      </div>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        PHS 398 Modular Budget [V1.2]
                      </div>
                    </div>
                    <div class="display-flex pt-2">
                      <div class="font-weight-medium primary--text">
                        PHS Assignment Request Form [V2.0]
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
          <div class="display-flex pt-4">
            <v-btn
              color="primary"
              class="ma-auto"
              :disabled="isDisabled || isLoading"
              :loading="isLoading"
              @click="sendApplication()"
            >
              Send Application
            </v-btn>
          </div>
        </div>
        <div v-else class="display-flex">
          <v-progress-circular class="ma-auto" indeterminate color="primary" />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';
  import { AccessService } from '@deip/access-service';
  import { UsersService } from '@deip/users-service';

  const accessService = AccessService.getInstance();
  const usersService = UsersService.getInstance();

  export default {

    name: 'UploadApplicationFileDialog',

    components: {
      vueDropzone
    },

    props: {
      program: { required: true, type: Object },
      meta: { required: true, type: Object }
    },

    data() {
      return {
        isLoading: false,
        research: null,
        researchList: null,
        title: '',
        totalAmount: '',
        timestamp: null,
        allAttached: true,
        organization: '',
        filesCount: 0,

        filesMap: {
          'Application Content.pdf': false,

          'PerformanceSite_2_0-V2.0.pdf': false,
          'PHS398_CoverPageSupplement_4_0-V4.0': false,
          'PHS398_ResearchPlan_4_0-V4.0.pdf': false,
          'PHSHumanSubjectsAndClinicalTrialsInfo-V1.0.pdf': false,
          'RR_KeyPersonExpanded_2_0-V2.0.pdf': false,
          'RR_OtherProjectInfo_1_4-V1.4.pdf': false,
          'RR_SF424_2_0-V2.0.pdf': false
        }
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        applications: 'agencyGrantProgramDetails/applications'
      }),
      isDisabled() {
        if (!this.totalAmount) return true;
        const amount = parseInt(this.totalAmount);
        const minFloor = this.fromAssetsToFloat(this.program.award_floor);
        const maxCeiling = this.fromAssetsToFloat(this.program.award_ceiling);
        return !this.research || !(amount >= minFloor && amount <= maxCeiling)
          || !this.organization || !this.title || !this.filesCount;
      },
      dropzoneOptions() {
        const accessToken = accessService.getAccessToken();

        return this.research != null && this.program != null && this.timestamp ? {
          url: `${window.env.DEIP_SERVER_URL}/applications/upload-files`,
          paramName: 'application-content',
          headers: {
            organization: window.env.TENANT,
            'Research-Id': this.research.id.toString(),
            'Foa-Id': this.program.id.toString(),
            Authorization: `Bearer ${accessToken}`,
            'Upload-Session': `${this.timestamp}-${accessToken.split('.')[2]}`
          },
          timeout: 0,
          maxFiles: 10,
          parallelUploads: 10,
          uploadMultiple: true,
          thumbnailWidth: 150,
          autoProcessQueue: false,
          addRemoveLinks: true,
          acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
        } : null;
      }
    },

    watch: {
      'meta.isOpen': function (newVal, oldVal) {
        if (newVal) {
          this.allAttached = false;
          this.timestamp = (new Date()).getTime();
          this.research = null;
          this.title = `Application for ${`${this.program.funding_opportunity_number} # ${this.applications.length + 1}`}`;
          this.totalAmount = '';
          this.organization = '';
          this.filesCount = 0;
        }
      }
    },

    created() {
      const researchPromises = this.userGroups.map((g) => deipRpc.api.getResearchesByResearchGroupAsync(g.external_id));
      const researchGroupPromises = this.userGroups.map((g) => deipRpc.api.getResearchGroupByIdAsync(g.id));

      Promise.all([
        Promise.all(researchPromises),
        Promise.all(researchGroupPromises)
      ])
        .then(([groupsResearchList, groups]) => {
          const flatten = [].concat.apply([], groupsResearchList);
          this.researchList = flatten;

          // todo: make workable receiving of all groups in system
          this.researchList.forEach((research) => {
            research.group = groups.find((group) => group.permlink === research.research_group.permlink);
          });

          groups.map((group) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
            .then((researchGroupTokens) => usersService.getEnrichedProfiles(researchGroupTokens.map((t) => t.owner)))
            .then((profiles) => group.enrichedMembers = profiles));
        });
    },

    methods: {
      applicationTotalAmountRule(value) {
        if (value === '') return true;
        const amount = parseInt(value);
        const minFloor = this.fromAssetsToFloat(this.program.award_floor);
        const maxCeiling = this.fromAssetsToFloat(this.program.award_ceiling);
        return (amount >= minFloor && amount <= maxCeiling) || `Amount should be between $${minFloor} and $${maxCeiling}`;
      },
      applicationTitleRule(value) {
        return value !== '' || 'Title field is required';
      },
      researchFilter(item, queryText, itemText) {
        return item.disciplines.some((d) => this.program.target_disciplines.some(td => d.id == t.id));
      },
      close() {
        this.isLoading = false;
        this.meta.isOpen = false;
        if (this.$refs.newApplication) {
          this.$refs.newApplication.removeAllFiles();
        }
      },
      sendApplication() {
        this.isLoading = true;
        this.$refs.newApplication.processQueue();
      },
      vdropzoneError(file, message, xhr) {
        this.$notifier.showError('Sorry, the file storage server is temporarily unavailable, please try again later');
        this.close();
      },
      vdropzoneFileAdded(file) {
        this.filesCount++;
        this.filesMap[file.name] = true;
      },
      vdropzoneRemovedFile(file) {
        this.filesCount--;
        this.filesMap[file.name] = false;
      },
      vsuccessMultiple(files, res) {
        const self = this;
        const applicationRef = res;

        if (!applicationRef.hash) {
          throw new Error('File upload has failed');
        }

        deipRpc.broadcast.createGrantApplicationAsync(
          this.user.privKey,
          this.program.id,
          this.research.id,
          this.title,
          this.user.username,
          this.toAssetUnits(this.totalAmount),
          `${applicationRef.letterHash}:${applicationRef.hash}`,
          this.organization,
          []
        )
          .then((res) => {
            // todo: Reload applications section
            this.$notifier.showSuccess('Application has been sent successfully!');

            return new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramDetails/loadorganizationProgramApplications', { notify: resolve });
            });
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred while sending Application, please try again later');
            console.error(err);
          })
          .finally(() => {
            this.isLoading = false;
            this.close();
          });
      }
    }
  };
</script>

<style lang="less" scoped>

  #application-dropzone {
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
