<template>
  <v-dialog v-model="meta.isOpen" persistent transition="scale-transition" max-width="500px">
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
            <v-select
              :items="researchList"
              v-model="research"
              placeholder="Select Research Project"
              >
              <template slot="selection" slot-scope="data">
                <div class="row-nowrap align-center c-pl-4">
                  <span class="deip-blue-color c-pl-3">{{ data.item.title }}</span>
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

            <div v-if="dropzoneOptions">
              <div>
                <vue-dropzone ref="newApplication" id="application-dropzone" 
                    :options="dropzoneOptions" 
                    @vdropzone-success="vdropzoneSuccess"
                    @vdropzone-error="vdropzoneError">
                </vue-dropzone>
              </div>
            </div>

            <div class="display-flex c-pt-8">
                <v-btn color="primary" 
                    class="c-m-auto"
                    :disabled="isDisabled || isLoading"
                    :loading="isLoading"
                    @click="sendApplication()">
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
            researchList: null
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
            return this.research != null && this.program != null ? {
              url: `${window.env.DEIP_SERVER_URL}/applications/upload-file`,
              paramName: "application-content",
              headers: {
                "Agency": window.tenant,
                "Research-Id": this.research.id.toString(),
                "Foa-Id": this.program.id.toString(),
                "Authorization": 'Bearer ' + getAccessToken()
              },
              timeout: 0,
              maxFiles: 1,
              thumbnailWidth: 150,
              autoProcessQueue: false,
              acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
            } : null;
          }
        },

        methods: {
          close() {
              this.isLoading = false;
              this.$refs.newApplication.removeAllFiles();
              this.meta.isOpen = false;
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
          vdropzoneSuccess(file, res) {
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
          }
        },
        watch: {
          'meta.isOpen': function (newVal, oldVal) {
            if (newVal) {
              this.research = null;
            } 
          }
        },
        created() {
          const researchPromises = this.userGroups.map(g => deipRpc.api.getResearchesByResearchGroupIdAsync(g.id));
          Promise.all(researchPromises)
            .then((groupsResearchList) => {
              const flatten = [].concat.apply([], groupsResearchList);
              this.researchList = flatten;
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

