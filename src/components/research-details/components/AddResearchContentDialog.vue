<template>
<div>
   <div v-if="dropzoneOptions">
        <vue-dropzone ref="newContent" id="content-dropzone" 
            :options="dropzoneOptions" 
            @vdropzone-file-added="vdropzoneFileAdded"
            @vdropzone-success="vdropzoneSuccess"
            @vdropzone-error="vdropzoneError">
        </vue-dropzone>
    </div>

    <v-dialog v-if="research" v-model="isOpen" persistent transition="scale-transition" max-width="500px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Propose content for research</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <div class="column-page">
                <div class="content-column">
                    <div class="filling">
                        <div v-if="membersList.length">

                            <v-text-field
                                label="Title"
                                v-model="title"
                                hide-details>
                            </v-text-field>

                            <v-select v-model="type" 
                                :items="contentTypes" 
                                label="Content Type" 
                                class="c-mt-6"
                                item-value="id">
                            </v-select>

                            <v-select
                                :items="membersList"
                                v-model="authors"
                                placeholder="Authors"
                                autocomplete
                                multiple>
                                
                                <template slot="selection" slot-scope="data">
                                    <div class="row-nowrap align-center c-pl-4">
                                        <v-avatar size="30px">
                                            <v-gravatar :email="data.item.owner + '@deip.world'" />
                                        </v-avatar>
                                        <span class="deip-blue-color c-pl-3">{{ data.item.owner }}</span>
                                    </div>
                                </template>
                                
                                <template slot="item" slot-scope="data">
                                    <template>
                                        <div class="row-nowrap align-center author-item" 
                                            :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                                            <v-avatar size="30px">
                                                <v-gravatar :email="data.item.owner + '@deip.world'" />
                                            </v-avatar>
                                            <span class="deip-blue-color c-pl-3">{{ data.item.owner }}</span>
                                        </div>
                                    </template>
                                </template>
                            </v-select>


                            <div class="display-flex c-pt-8">
                                <v-btn color="primary" 
                                    class="c-m-auto"
                                    :disabled="isDisabled || isLoading"
                                    :loading="isLoading"
                                    @click="proposeContent()"
                                >Create proposal</v-btn>
                            </div>
                        </div>

                        <div class="display-flex" v-else>
                            <v-progress-circular class="c-m-auto" indeterminate color="primary"></v-progress-circular>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-dialog>

    <v-snackbar :timeout="5000" color="error" v-model="isError">
        {{errorMessage ? errorMessage : "An error occurred while uploading the file, please try again later"}}
        <v-btn dark flat @click.native="isError = false; errorMessage = '';">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="5000" color="success" v-model="isSuccess">
            New Content Proposal has been created successfuly!
        <v-btn dark flat @click.native="isSuccess = false;">Close</v-btn>
    </v-snackbar>

    </div>
</template>


<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc';
    import config from './../../../config'
    import {getAccessToken} from './../../../utils/auth'
    import { mapGetters } from 'vuex';
    import * as proposalService from "./../../research-group/services/ProposalService";
    import vueDropzone from 'vue2-dropzone';

    export default {
        components: {
            vueDropzone
        },
        name: "AddResearchContentDialog",
        data() { 
            return {
                title: "",
                permlink: "",
                type: null,
                authors: [],
                
                contentTypes: [
                    { text: 'Announcement', id: 1 },
                    { text: 'Milestone', id: 2 },
                    { text: 'Final Result', id: 3 }
                ],

                isOpen: false,
                isLoading: false,
                isSuccess: false,
                isError: false,
                errorMessage: ""
            }
        },
        computed: {
            ...mapGetters({
                user: 'user',
                membersList: 'rd/membersList',
                research: 'rd/research',
            }),
            isDisabled() {
                return !this.title ||
                       !this.type ||
                       !this.authors.length
            },
            dropzoneOptions() {
                return this.research != null ? {
                        url: `${config['deip-server-url']}/api/files/upload-content`,
                        paramName: "research-content",
                        headers: {
                            "Research-Id": this.research.id.toString(),
                            "Authorization": 'Bearer ' + getAccessToken()
                        },
                        maxFiles: 1,
                        thumbnailWidth: 150,
                        autoProcessQueue: false,
                        acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
                    } : null;
            }
        },

        methods: {
            isAuthorSelected(item){
                return this.authors.find(author => { return author.owner == item.owner }) !== undefined;
            },
            close() {
                this.isLoading = false;
                this.$refs.newContent.removeAllFiles();
                this.isOpen = false;
            },
            proposeContent() {
                this.isLoading = true;
                this.$refs.newContent.processQueue();
            },
            vdropzoneError(file, message, xhr) {
                this.errorMessage = "Sorry, the server is temporarily unavailable"
                this.isError = true;
                this.close();
            },
            vdropzoneFileAdded(file) {
                this.isOpen = true;
            },
            vdropzoneSuccess(file, response) {

                const hash = JSON.parse(file.xhr.response).hash;

                const proposal = proposalService.getStringifiedProposalData(proposalService.types.createResearchMaterial, [
                    this.research.id,
                    this.type,
                    this.title,
                    this.title.replace(/[^a-zA-Z0-9-_]+/ig,''),
                    hash,
                    this.authors.map(a => {return a.owner}),
                    [],
                    []
                ]);

                deipRpc.broadcast.createProposalAsync(
					this.user.privKey,
					this.user.username, 
					this.research.research_group_id, 
					proposal,
                    proposalService.types.createResearchMaterial,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.isSuccess = true;
                    this.close();
                }, (err) => {
                    this.isError = true;
                    this.close();
                });
            }

        },
        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.title = '';
                    this.type = null;
                    this.authors = [];
                    this.isSuccess = false;
                } 
            }
        }
    };
</script>

<style lang="less" scoped>

    #content-dropzone {
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

