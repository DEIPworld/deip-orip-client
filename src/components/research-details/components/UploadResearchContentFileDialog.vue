<template>
<div>

    <div>
        <div v-if="dropzoneOptions">
            <vue-dropzone ref="newContent" id="content-dropzone" 
                :options="dropzoneOptions" 
                @vdropzone-file-added="vdropzoneFileAdded"
                @vdropzone-success="vdropzoneSuccess"
                @vdropzone-error="vdropzoneError">
            </vue-dropzone>
        </div>
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
                                            <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(30, 30, false)" />
                                            <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                        </v-avatar>
                                        <span class="deip-blue-color c-pl-3">{{ data.item | fullname }}</span>
                                    </div>
                                </template>
                                
                                <template slot="item" slot-scope="data">
                                    <template>
                                        <div class="row-nowrap align-center author-item" 
                                            :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                                            <v-avatar size="30px">
                                                <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(30, 30, false)" />
                                                <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                            </v-avatar>
                                            <span class="deip-blue-color c-pl-3">{{ data.item | fullname  }}</span>
                                        </div>
                                    </template>
                                </template>
                            </v-select>

                            <v-checkbox class="c-mt-6"
                                v-model="tmpIsPrivate"
                                label="Choose if content should be private"
                            ></v-checkbox>

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
    </div>
</template>


<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import {getAccessToken} from './../../../utils/auth'
    import { mapGetters } from 'vuex';
    import { signOperation } from './../../../utils/blockchain'
    import { createContentProposal, contentTypes } from './../../../services/ResearchService'
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
                contentTypes: contentTypes,

                isOpen: false,
                isLoading: false,

                tmpIsPrivate: false
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
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
                        url: `${process.env.DEIP_SERVER_URL}/content/upload-file`,
                        paramName: "research-content",
                        headers: {
                            "Research-Id": this.research.id.toString(),
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
                const contentRef = res;
                if (!contentRef.hash) {
                    throw new Error("File upload has failed")
                }
                contentRef.title = this.title;

                createContentProposal(contentRef, this.type, this.authors.map(a => a.account.name))
                    .then((updatedRequest) => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "New Content Proposal has been created successfuly!"
                        });
                        this.$router.push({
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: this.$route.params.research_group_permlink  }
                        });
                    }, (err) => {
                        console.log(err) 
                        this.$store.dispatch('layout/setError', {
                            message: "An error occurred while creating proposal, please try again later"
                        });
                    })
                    .finally(() => {
                        this.proposeContent.isOpen = false;
                        this.proposeContent.isLoading = false;
                    })
                }
        },
        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.title = '';
                    this.type = null;
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

