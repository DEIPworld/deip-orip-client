<template>
  <v-dialog v-model="meta.isOpen" fullscreen persistent transition="scale-transition">
    <v-card class="">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Application</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-layout row>
        <v-flex class="fill-height pa-5 xs12">
          <div v-if="researchList">
            <v-layout row mb-3>
              <div class="pr-3">Funding opportunity:</div>
              <div class="a subheading">{{ program.additional_info.funding_opportunity_title }}</div>
            </v-layout>
            <v-divider></v-divider>
            <v-autocomplete
              class="mt-3"
              :items="researchList"
              :filter="researchFilter"
              v-model="research"
              label="Research"
            >
              <template slot="selection" slot-scope="data">
                <v-layout align-center>
                  <span>{{ data.item.title }}</span>
                </v-layout>
              </template>
              <template slot="item" slot-scope="data">
                <template>
                  <v-layout align-center author-item>
                    <span class="pl-3">{{ data.item.title}}</span>
                  </v-layout>
                </template>
              </template>
            </v-autocomplete>
            <div v-if="research">
              <div class="pt-3 pb-3">
                <div class="title">
                  <span class="font-weight-medium">Research group:</span>
                  <router-link class="a"
                               :to="{
                        name: 'ResearchDetails',
                        params: {
                            research_group_permlink: encodeURIComponent(research.group_permlink),
                            research_permlink: encodeURIComponent(research.permlink)
                        }
                    }"
                  >{{ research.group.name }}
                  </router-link>
                </div>
                <v-layout row pt-3>
                  
                  <v-layout v-for="(member, i) in research.group.enrichedMembers" :key="i"
                       text-align-center pt-2 pr-3>
                    <platform-avatar
                      :user="member"
                      :size="40"
                      link-to-profile
                      link-to-profile-class="px-1"
                    ></platform-avatar>
                  </v-layout>
                </v-layout>
              </div>
              <v-divider></v-divider>
              <div class="py-3">
                <v-layout row justify-center>
                  <v-flex xs6 pr-3>
                    <v-text-field class=""
                                  label="Title"
                                  v-model="title"
                                  :rules="[
                        applicationTitleRule
                      ]">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 pl-3>
                    <v-text-field class=""
                                  label="Total amount"
                                  suffix="$"
                                  v-model="totalAmount"
                                  :rules="[
                        applicationTotalAmountRule
                      ]">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row justify-center>
                  <v-flex xs12>
                    <v-text-field class=""
                                  label="Organization"
                                  v-model="organization"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </div>
              <div v-if="dropzoneOptions">
                <div>
                  <vue-dropzone ref="newApplication" id="application-dropzone"
                                :options="dropzoneOptions"
                                @vdropzone-file-added="vdropzoneFileAdded"
                                @vdropzone-removed-file="vdropzoneRemovedFile"
                                @vdropzone-error="vdropzoneError"
                                @vdropzone-success-multiple="vsuccessMultiple"></vue-dropzone>
                </div>
              </div>
              <v-layout row wrap pt-3>
                <v-flex xs12 mb-3>
                  <v-layout row align-center height-2 pt-3 pb-3>
                    <div class="font-weight-bold pr-3">Application</div>
                    <div class="font-weight-medium primary--text">Application content</div>
                    <v-icon v-show="filesMap['Application Content.pdf']" color="green" class="pl-3">check_circle
                    </v-icon>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout row>
                    <v-flex xs6>
                      <div class="font-weight-bold">Mandatory forms</div>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">SF424 (R &amp; R) [V2.0]</div>
                        <v-icon v-show="filesMap['RR_SF424_2_0-V2.0.pdf']" color="green" class="pl-3">check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">PHS 398 Cover Page Supplement [V4.0]</div>
                        <v-icon v-show="filesMap['PHS398_CoverPageSupplement_4_0-V4.0.pdf']" color="green"
                                class="pl-3">check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">Research And Related Other Project Information [V1.4]</div>
                        <v-icon v-show="filesMap['RR_OtherProjectInfo_1_4-V1.4.pdf']" color="green" class="pl-3">
                          check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">Project/Performance Site Location(s) [V2.0]</div>
                        <v-icon v-show="filesMap['PerformanceSite_2_0-V2.0.pdf']" color="green" class="pl-3">
                          check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">Research and Related Senior/Key Person Profile (Expanded)
                          [V2.0]
                        </div>
                        <v-icon v-show="filesMap['RR_KeyPersonExpanded_2_0-V2.0.pdf']" color="green" class="pl-3">
                          check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">PHS 398 Research Plan [V4.0]</div>
                        <v-icon v-show="filesMap['PHS398_ResearchPlan_4_0-V4.0.pdf']" color="green" class="pl-3">
                          check_circle
                        </v-icon>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">PHS Human Subjects and Clinical Trials Information [V1.0]
                        </div>
                        <v-icon v-show="filesMap['PHSHumanSubjectsAndClinicalTrialsInfo-V1.0.pdf']" color="green"
                                class="pl-3">check_circle
                        </v-icon>
                      </v-layout>
                    </v-flex>
                    <v-flex xs6>
                      <div class="font-weight-bold">Optional forms</div>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">Research &amp; Related Budget [V1.4]</div>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">R &amp; R Subaward Budget Attachment(s) Form 5 YR 30 ATT
                          [V1.4]
                        </div>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">PHS 398 Modular Budget [V1.2]</div>
                      </v-layout>
                      <v-layout row align-center height-2 pt-3>
                        <div class="font-weight-medium primary--text">PHS Assignment Request Form [V2.0]</div>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
            <div class="display-flex pt-3">
              <v-btn color="primary"
                     class="ma-auto"
                     :disabled="isDisabled || isLoading"
                     :loading="isLoading"
                     @click="sendApplication()"
              >
                Send Application
              </v-btn>
            </div>
          </div>
          <div class="display-flex" v-else>
            <v-progress-circular class="ma-auto" indeterminate color="primary"></v-progress-circular>
          </div>
        </v-flex>
      </v-layout>
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

    components: {
      vueDropzone
    },

    props: {
      program: { required: true, type: Object },
      meta: { required: true, type: Object }
    },

    name: 'UploadApplicationFileDialog',

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
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        applications: 'agencyGrantProgramDetails/applications',
      }),
      isDisabled() {
        if (!this.totalAmount) return true;
        const amount = parseInt(this.totalAmount);
        const minFloor = this.fromAssetsToFloat(this.program.award_floor);
        const maxCeiling = this.fromAssetsToFloat(this.program.award_ceiling);
        return !this.research || !(amount >= minFloor && amount <= maxCeiling) ||
          !this.organization || !this.title || !this.filesCount;
      },
      dropzoneOptions() {
        const accessToken = accessService.getAccessToken();

        return this.research != null && this.program != null && this.timestamp ? {
          url: `${window.env.DEIP_SERVER_URL}/applications/upload-files`,
          paramName: 'application-content',
          headers: {
            'organization': window.env.TENANT,
            'Research-Id': this.research.id.toString(),
            'Foa-Id': this.program.id.toString(),
            'Authorization': 'Bearer ' + accessToken,
            'Upload-Session': `${this.timestamp}-${accessToken.split('.')[2]}`
          },
          timeout: 0,
          maxFiles: 10,
          parallelUploads: 10,
          uploadMultiple: true,
          thumbnailWidth: 150,
          autoProcessQueue: false,
          addRemoveLinks: true,
          acceptedFiles: [ 'application/pdf', 'image/png', 'image/jpeg' ].join(',')
        } : null;
      }
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
        return item.disciplines.some(d => d.id === this.program.target_discipline);
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
        this.$store.dispatch('layout/setError', {
          message: 'Sorry, the file storage server is temporarily unavailable, please try again later'
        });
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
          throw new Error('File upload has failed')
        }

        deipRpc.broadcast.createGrantApplicationAsync(
          this.user.privKey,
          this.program.id,
          this.research.id,
          this.title,
          this.user.username,
          this.toAssetUnits(this.totalAmount),
          `${applicationRef.letterHash}:${applicationRef.hash}`,
          this.organization
        )
          .then((res) => {
            // todo: Reload applications section
            this.$store.dispatch('layout/setSuccess', {
              message: `Application has been sent successfully!`
            });

            return new Promise((resolve, reject) => {
              this.$store.dispatch('agencyGrantProgramDetails/loadorganizationProgramApplications', { notify: resolve })
            });
          })
          .catch(err => {
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending Application, please try again later'
            });
            console.log(err)
          })
          .finally(() => {
            this.isLoading = false;
            this.close();
          });
      }
    },

    watch: {
      'meta.isOpen': function (newVal, oldVal) {
        if (newVal) {
          this.allAttached = false;
          this.timestamp = (new Date()).getTime();
          this.research = null;
          this.title =
            `Application for ${this.program.funding_opportunity_number + ' # ' + (this.applications.length + 1)}`;
          this.totalAmount = '';
          this.organization = '';
          this.filesCount = 0;
        }
      }
    },

    created() {

      const researchPromises = this.userGroups.map(g => deipRpc.api.getResearchesByResearchGroupIdAsync(g.id));
      const researchGroupPromises = this.userGroups.map(g => deipRpc.api.getResearchGroupByIdAsync(g.id));

      Promise.all([
        Promise.all(researchPromises),
        Promise.all(researchGroupPromises)
      ])
        .then(([ groupsResearchList, groups ]) => {
          const flatten = [].concat.apply([], groupsResearchList);
          this.researchList = flatten;

          // todo: make workable receiving of all groups in system
          this.researchList.forEach(research => {
            research.group = groups.find(group => group.permlink === research.group_permlink);
          })

          groups.map(group =>
            deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
              .then(researchGroupTokens => usersService.getEnrichedProfiles(researchGroupTokens.map(t => t.owner)))
              .then(profiles => group.enrichedMembers = profiles));
        });
    },
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

