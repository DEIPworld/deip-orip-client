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

      <page-container>
        <contentbar>
          <div v-if="researchList">
            <div class="row c-mb-4">
              <div class="c-pr-6">Funding opportunity:</div>
              <div class="col-grow a subheading">{{ program.funding_opportunity_title }}</div>
            </div>

            <v-divider></v-divider>

            <v-select
              class="c-mt-4"
              :items="researchList"
              v-model="research"
              label="Research"
            >
              <template slot="selection" slot-scope="data">
                <div class="row-nowrap align-center">
                  <span class="deip-blue-color">{{ data.item.title }}</span>
                </div>
              </template>

              <template slot="item" slot-scope="data">
                <template>
                  <div class="row-nowrap align-center author-item">
                    <span class="deip-blue-color c-pl-3">{{ data.item.title}}</span>
                  </div>
                </template>
              </template>
            </v-select>

            <div v-if="research">
              <div class="c-pt-4 c-pb-8">
                <div class="sm-title">
                  <span class="half-bold">Research group:</span>

                  <router-link class="a"
                    :to="{
                        name: 'ResearchDetails',
                        params: {
                            research_group_permlink: encodeURIComponent(research.group_permlink),
                            research_permlink: encodeURIComponent(research.permlink)
                        }
                    }"
                  >{{ research.group.name }}</router-link>
                </div>

                <div class="c-pt-4 row">
                  <div v-for="(member, i) in research.group.enrichedMembers" :key="i"
                    class="row-nowrap text-align-center c-pt-2 c-pr-8"
                  >
                      <v-avatar size="40px">
                          <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(30, 30, false)" />
                          <v-gravatar v-else :email="member.account.name + '@deip.world'" />
                      </v-avatar>

                      <router-link class="a deip-blue-color body-1 c-pl-3 c-pt-2" :to="{ name: 'UserDetails', params: { account_name: member.account.name } }">
                        {{ member | fullname }}
                      </router-link>
                    </div>
                </div>
              </div>

              <v-divider></v-divider>

              <div class="c-pv-4">
                <div class="row justify-center">
                  <v-text-field class="col-6 c-pr-1" label="Title" v-model="title"></v-text-field>
                  <v-text-field class="col-6 c-pl-1" label="Total amount" v-model="totalAmount"></v-text-field>
                </div>
              </div>

            
              <div v-if="dropzoneOptions">
                <div>
                  <vue-dropzone ref="newApplication" id="application-dropzone" 
                      :options="dropzoneOptions" 
                      @vdropzone-file-added="vdropzoneFileAdded"
                      @vdropzone-error="vdropzoneError"
                      @vdropzone-success-multiple="vsuccessMultiple">
                  </vue-dropzone>
                </div>
              </div>

              <div class="row c-pt-8">
                <div class="col-6">
                  <div class="bold">Mandatory forms</div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">SF424 (R &amp; R) [V2.0]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">Project/Performance Site Location(s) [V2.0]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">Research And Related Other Project Information [V1.4]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">NSF Senior Key Person Profile (Expanded) [V1.1]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">Research &amp; Related Budget [V1.4]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">Research &amp; Related Personal Data [V1.2]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">NSF Cover Page [V1.8]</div>
                    <v-icon v-show="allAttached" color="green" class="c-pl-4">check_circle</v-icon>
                  </div>
                </div>
                
                <div class="col-6">
                  <div class="bold">Optional forms</div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">NFS Deviation Authorization [V1.1]</div>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">NFS Suggested Reviewers [V1.1]</div>
                  </div>

                  <div class="row align-items-center height-2 c-pt-4">
                    <div class="half-bold primary--text">R &amp; R Subaward Budget Attachment(s) Form [V1.4]</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="display-flex c-pt-8">
                <v-btn color="primary" 
                  class="c-m-auto"
                  :disabled="isDisabled || isLoading"
                  :loading="isLoading"
                  @click="sendApplication()"
                >
                  Send Application
                </v-btn>
            </div>
          </div>

          <div class="display-flex" v-else>
            <v-progress-circular class="c-m-auto" indeterminate color="primary"></v-progress-circular>
          </div>
        </contentbar>
      </page-container>
    </v-card>
  </v-dialog>
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { getAccessToken } from './../../../utils/auth'
    import { getEnrichedProfiles } from './../../../utils/user';
    import { mapGetters } from 'vuex';
    import { signOperation } from './../../../utils/blockchain'
    import vueDropzone from 'vue2-dropzone';

    export default {
        components: {
          vueDropzone
        },

        props: {
          program: { required: true, type: Object },
          meta: { required: true, type: Object}
        },

        name: "UploadApplicationFileDialog",

        data() { 
          return {
            isLoading: false,
            research: null,
            researchList: null,
            title: '',
            totalAmount: '',
            timestamp: null,
            allAttached: true
          }
        },

        computed: {
          ...mapGetters({
              user: 'auth/user',
              userGroups: 'auth/userGroups'
          }),
          isDisabled() {
              return !this.research;
          },
          dropzoneOptions() {
            return this.research != null && this.program != null && this.timestamp ? {
              url: `${window.env.DEIP_SERVER_URL}/applications/upload-files`,
              paramName: "application-content",
              headers: {
                "Agency": window.tenant,
                "Research-Id": this.research.id.toString(),
                "Foa-Id": this.program.id.toString(),
                "Authorization": 'Bearer ' + getAccessToken(),
                "Upload-Session": `${this.timestamp}-${getAccessToken().split('.')[2]}`
              },
              timeout: 0,
              maxFiles: 10,
              parallelUploads: 10,
              uploadMultiple: true,
              thumbnailWidth: 150,
              autoProcessQueue: false,
              acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
            } : null;
          }
        },

        methods: {
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
                  message: "Sorry, the file storage server is temporarily unavailable, please try again later"
              });
              this.close();
          },

          vdropzoneFileAdded() {
            this.allAttached = true;
          },
          vsuccessMultiple(files, res) {
            const self = this;
            const applicationRef = res;

            if (!applicationRef.hash) {
                throw new Error("File upload has failed")
            }

            deipRpc.broadcast.createGrantApplicationAsync(
              this.user.privKey,
              this.program.id,
              this.research.id,
              this.user.username,
              applicationRef.hash
            )
            .then((res) => {
              // todo: Reload applications section
              this.$store.dispatch('layout/setSuccess', {
                message: `Application has been sent successfully!`
              });
            })
            .catch(err => { 
              this.$store.dispatch('layout/setError', {
                message: "An error occurred while sending Application, please try again later"
              });
              console.log(err)
            })
            .finally(() => { 
              this.isLoading = false;
              this.close();
            });
          },
        },

        watch: {
          'meta.isOpen': function (newVal, oldVal) {
            if (newVal) {
              this.allAttached = false;
              this.timestamp = (new Date()).getTime();
              this.research = null;
              this.title = '';
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
            .then(([groupsResearchList, groups]) => {
              const flatten = [].concat.apply([], groupsResearchList);
              this.researchList = flatten;

              this.researchList.forEach(research => {
                research.group = groups.find(group => group.permlink === research.group_permlink);
              })

              groups.map(group =>
                deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
                    .then(researchGroupTokens => 
                        getEnrichedProfiles(researchGroupTokens.map(t => t.owner))
                    )
                    .then(profiles => 
                      group.enrichedMembers = profiles
                    )
              )
            })
        },
    };
</script>

<style lang="less" scoped>

    #application-dropzone {
        margin-left: -1px;
        margin-right: -1px;
    }

    .dialog.dialog--active {
        overflow: visible;
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

