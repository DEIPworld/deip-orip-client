<template>
<div>

    <div>
        <div v-if="dropzoneOptions">
            <vue-dropzone ref="newContent" id="content-dropzone" 
                :options="dropzoneOptions" 
                @vdropzone-file-added="vdropzoneFileAdded"
                @vdropzone-success-multiple="vdropzoneSuccess"
                @vdropzone-error="vdropzoneError">
            </vue-dropzone>
        </div>
    </div>
        <v-dialog v-if="research" v-model="isOpen" persistent transition="scale-transition" max-width="600px">
            <v-card class="pa-4">
              <v-card-title>
                <span class="headline">Propose content for Research</span>
              </v-card-title>
              <v-card-text>
                    <div v-if="researchGroupMembersList.length">
                        <v-text-field
                            label="Title"
                            v-model="title"
                            hide-details>
                        </v-text-field>

                        <v-select v-model="type" 
                            :items="contentTypesList" 
                            label="Content Type" 
                            class="c-mt-6"
                            item-value="id">
                        </v-select>

                        <v-autocomplete
                            :items="researchGroupMembersList"
                            :menu-props="{ closeOnContentClick: true }"
                            v-model="authors"
                            hint="You can select multiple authors"
                            persistent-hint
                            placeholder="Authors"
                            multiple>
                            
                            <template slot="selection" slot-scope="data">
                                <div class="legacy-row-nowrap align-center c-pl-4">
                                    <v-avatar size="30px">
                                        <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(60, 60, false)" />
                                        <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <span class="deip-blue-color c-pl-3">{{ data.item | fullname }}</span>
                                </div>
                            </template>
                            
                            <template slot="item" slot-scope="data">
                                <template>
                                    <div class="legacy-row-nowrap align-center author-item" 
                                        :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                                        <v-avatar size="30px">
                                            <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(60, 60, false)" />
                                            <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                        </v-avatar>
                                        <span class="deip-blue-color c-pl-3">{{ data.item | fullname  }}</span>
                                    </div>
                                </template>
                            </template>
                        </v-autocomplete>
                    </div>
              </v-card-text>
              <v-card-actions>
                <v-layout column>
                    <v-btn 
                        color="primary" 
                        class="mx-0 my-1 pa-0"
                        :disabled="isDisabled || isLoading"
                        :loading="isLoading"
                        @click="proposeContent()"
                    >{{!isPersonalGroup ? 'Create Proposal' : 'Create Content'}}</v-btn>

                    <v-btn 
                        @click="close()"
                        :disabled="isLoading"
                        color="black" 
                        flat 
                        class="mx-0 my-1 pa-0">Cancel</v-btn>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </div>
</template>


<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import {getAccessToken} from './../../../utils/auth'
    import { mapGetters } from 'vuex';
    import { signOperation } from './../../../utils/blockchain'
    import { contentTypesList } from './../../../services/ResearchService'
    import { createContentProposal } from './../../../services/ProposalService';
    import vueDropzone from 'vue2-dropzone';

    export default {
        components: {
            vueDropzone
        },
        name: "UploadResearchContentFileDialog",
        data() { 
            return {
                title: "",
                type: null,
                authors: [],
                contentTypesList: contentTypesList,

                isOpen: false,
                isLoading: false,

                tmpIsPrivate: false
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                researchGroupMembersList: 'rd/researchGroupMembersList',
                research: 'rd/research',
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            isPersonalGroup() {
                return this.research 
                    ? this.research.research_group_id == this.userPersonalGroup.id 
                    : false;
            },
            isDisabled() {
                return !this.title ||
                       !this.type ||
                       !this.authors.length
            },
            dropzoneOptions() {
                return this.research != null ? {
                        url: `${window.env.DEIP_SERVER_URL}/content/upload-files`,
                        paramName: "research-content",
                        headers: {
                            "Research-Id": this.research.id.toString(),
                            "Authorization": 'Bearer ' + getAccessToken(),
                            "Upload-Session": `${(new Date()).getTime()}-${getAccessToken().split('.')[2]}`
                        },
                        timeout: 0,
                        maxFiles: 10,
                        parallelUploads: 10,
                        uploadMultiple: true,
                        thumbnailWidth: 150,
                        autoProcessQueue: false,
                        addRemoveLinks: true,
                        // acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
                    } : null;
            }
        },

        methods: {
            isAuthorSelected(item) {
                return this.authors.find(author => { return author.account.name == item.account.name }) !== undefined;
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
                this.$store.dispatch('layout/setError', {
                    message: "Sorry, the file storage server is temporarily unavailable, please try again later"
                });
                this.close();
            },
            vdropzoneFileAdded(file) {
                this.isOpen = true;
            },
            vdropzoneSuccess(file, res) {
                const self = this;
                const contentRef = res;
                if (!contentRef.hash) {
                    throw new Error("File upload has failed")
                }
                contentRef.title = this.title;
                contentRef.authors = this.authors.map(a => a.account.name);
                contentRef.references = [];

                createContentProposal(contentRef, this.type)
                    .then(() => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "New Content Proposal has been created successfuly!"
                        });
                    }, (err) => {
                        console.log(err);
                        if (err.response && err.response.status == 409) {
                            alert("This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.");
                        } else {
                            this.$store.dispatch('layout/setError', { 
                                message: "An error occurred while creating proposal, please try again later"
                            });
                        }
                    })
                    .finally(() => {
                        this.$emit('onFinish');
                        this.close();
                    })
                }
        },
        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.title = '';
                    this.type = null;
                    this.timestamp = (new Date()).getTime();
                    this.authors = [];
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

