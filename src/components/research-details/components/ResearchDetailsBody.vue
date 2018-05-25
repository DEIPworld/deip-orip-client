<template>
    <div>
        <div v-if="research" class="row justify-between align-center">
            <div>
                <v-icon size="18px">date_range</v-icon>
                <span>Created on {{ new Date(research.created_at).toDateString() }}</span>
            </div>
           <!-- <v-btn @click="afterComplete" small color="primary" class="ma-0">Vote</v-btn> -->
        </div>

        <div v-if="research" class="display-1 half-bold c-mt-10">
            {{ research.title }}
        </div>

        <div v-if="research" class="c-pt-8">
            {{ research.abstract }}
        </div>

        <div class="c-pt-8 title">Timeline</div>

        <div class="c-pt-6">
            <research-timeline :contentList="contentList" :research="research"></research-timeline>
        </div>

        <div class="c-pt-8 title">Research</div>

        <div class="c-pt-6">
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(content, index) in contentList" :key="index">
                    <div slot="header">
                        <span class="bold">Chapter {{index + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"> 
                            <router-link  :to="`/${research.group_permlink}/research/${research.permlink}/${content.permlink}`" 
                                          style="text-decoration: none">{{content.title}}
                            </router-link>
                        </span>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption grey--text c-pt-2"> {{content.authors.join("  ·  ")}}</div>
                                <div class="c-pt-4 half-bold">
                                </div>
                                <div class="c-pt-2">
                                    <div class="row-nowrap">
                                        <div v-for="(discipline, index) in disciplinesList">
                                            <span v-if="contentWeightByDiscipline[content.id] && contentWeightByDiscipline[content.id][discipline.id]">
                                                <span class="c-pr-1">
                                                    <span class="bold green--text text--darken-2">{{discipline.name}}</span>
                                                </span>
                                                <span class="c-pr-4">
                                                    <span>{{contentWeightByDiscipline[content.id][discipline.id] }}</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row-nowrap c-mt-3">
                                        <div class="c-pr-10">
                                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                                        </div>
                                        <div class="c-pr-10">
                                            <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                                        </div>
                                        <div>
                                            <v-icon size="18px">date_range</v-icon> <span>{{new Date(content.created_at).toDateString()}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <div v-if="research && dropzoneOptions && !research.is_finished">
                <vue-dropzone ref="newContent" id="content-dropzone" 
                    :options="dropzoneOptions" 
                    @vdropzone-file-added="fileAdded"
                    @vdropzone-complete="afterComplete">
                </vue-dropzone>
            </div>

            <v-dialog v-if="research" v-model="newContentProposal.isOpen" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="text-align-center">Propose new content for &nbsp;<span class="bold">"{{research.title}}"</span>&nbsp;research</span>
                    </v-card-title>
          
                    <v-card-text class="new-content-dialog-body">
                        <div v-if="!newContentProposal.isInProgress">
                            <v-text-field label="Title" v-model="newContentProposal.title"></v-text-field>
                            <v-select v-model="newContentProposal.type" :items="contentTypes" label="Content Type" item-value="id"></v-select>
                            <v-select v-model="newContentProposal.authors" :items="authors" label="Authors" item-value="text" multiple
                                        max-height="100" hint="Pick authors of this content" persistent-hint></v-select>
                        </div>
                        <div class="loader" v-if="newContentProposal.isInProgress">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="primary" flat @click.stop="cancelNewContent()">Cancel</v-btn>
                        <v-btn color="primary" flat :disabled="!newContentBtnIsEnabled" @click.stop="proposeNewContent()">Propose</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

       <div class="c-pt-8 title" v-if="reviewsList.length">Reviews: {{ reviewsList.length }}</div>

        <div class="c-pt-6" v-if="reviewsList.length">
            <v-card class="hidden-last-child">
                <template v-for="(review, i) in reviewsList">
                    <div class="row-nowrap c-p-6">
                        <div class="review-left-block text-align-center">
                            <v-avatar size="90px">
                                <v-gravatar :title="review.author" :email="review.author + '@deip.world'" />
                            </v-avatar>
                            <div class="bold c-pt-2">{{ review.author }}</div>
                            <v-btn class="ma-0 mt-2" block color="primary">Vote</v-btn>
                        </div>
                        <div class="column c-ml-6">
                            <div>
                                <span class="grey--text">{{ new Date(review.created_at).toDateString() }}</span>
                                <span class="half-bold c-pl-2">
                                    <span class="green--text text--darken-2" v-if="review.is_positive">Positive</span>
                                    <span class="red--text text--darken-2" v-if="!review.is_positive">Negative</span>
                                </span>
                            </div>
                            <div class="c-pt-4 col-grow">
                                {{ review.content }}
                            </div>
                            <div class="c-pt-4 grey--text">
                                <!-- TODO: render votes for review -->
                                Economics 1 250 |  Psychology  320    
                            </div>
                        </div>
                    </div>

                    <v-divider></v-divider>
                </template>
            </v-card>
        </div>

        <!-- <div class="row c-pt-4 justify-end">
            <v-btn class="ma-0" color="primary">
                <v-icon>add</v-icon> Add a review
            </v-btn>
        </div> -->

        <!-- <div class="c-pt-4 title">Grants: 4</div>

        <div class="c-pt-6">
            <v-card>
                <div class="info-card-list">
                    <div class="list-line">
                        <div class="list-header-cell col-3">Organization</div>
                        <div class="list-header-cell col-5">Project</div>
                        <div class="list-header-cell col-2 text-align-center">Date</div>
                        <div class="list-header-cell col-2 text-align-right">Amount</div>
                    </div>
                    <div class="list-line" v-for="i in 5" :key="i">
                        <div class="col-3 list-body-cell a">JJHK</div>
                        <div class="col-5 list-body-cell">General Support</div>
                        <div class="col-2 list-body-cell text-align-center">20 Jan 2018</div>
                        <div class="col-2 list-body-cell text-align-right">$50 000</div>
                    </div>
                </div>
            </v-card>
        </div>-->

        <div class="c-pt-8 title">References: 2</div>

        <div class="c-pt-6">
            <div>
                1. Crawford, Lynn. (2007). Global body of project management knowledge and standards. 
                In Jeffrey K. Pinto & Peter W.G. Morris (Eds.): The Wiley Guide to Managing Projects (1st ed., pp. 206-252). 
                Hoboken, N.J.: Wiley & Sons, Inc.
            </div>
            <div class="c-pt-2">
                2. Kwak, Young Hoon, and Frank T. Anbari. (2009). Analysing project management research: Perspectives 
                from top management journals. International Journal of Project Management, 27(5), 435-446.
            </div>
        </div> 
    </div>
</template>

<script>
    import deipRpc from '@deip/deip-rpc';
    import vueDropzone from 'vue2-dropzone';
    import {getAccessToken} from './../../../utils/auth'
    import config from './../../../config'
    import * as proposalService from "./../../research-group/services/ProposalService";
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetailsBody",
        components: {
            vueDropzone
        },
        data() {
            return {

                newContentProposal: {
                    title: "",
                    permlink: "",
                    type: null,
                    authors: [],
                    isInProgress: false,
                    isOpen: false
                },

                contentTypes: [
                    { text: 'Announcement', id: 1 },
                    { text: 'Milestone', id: 2 },
                    { text: 'Final Result', id: 3 }
                ]
            }
        },

        computed: {
            ...mapGetters({
                user: 'user',
                research: 'rd/research',
                membersList: 'rd/membersList',
                contentList: 'rd/contentList',
                reviewsList: 'rd/reviewsList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                contentWeightByDiscipline: 'rd/contentWeightByDiscipline'
            }),
            
            authors: (state, getters) => {
                return state.membersList.map(m => { return { text: m.owner, id: m.id } });
            },

            newContentBtnIsEnabled() {
                return  this.newContentProposal.title && 
                        this.newContentProposal.type && 
                        this.newContentProposal.authors.length
            },

            dropzoneOptions() {
                var options = null;
                if(this.research) {
                    options = {
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
                    }
                } 
                return options
            }
        },
        methods: {
            fileAdded(file) {
                this.newContentProposal.isOpen = true;
            },
            proposeNewContent: function () {
                this.newContentProposal.isInProgress = true;
                this.$refs.newContent.processQueue();
            },
            cancelNewContent: function() {
                this.$refs.newContent.removeAllFiles();
                this.newContentProposal.isOpen = false;
            },
            afterComplete(file) {
                const hash = JSON.parse(file.xhr.response).hash;

                const proposal = proposalService.getStringifiedProposalData(proposalService.types.createResearchMaterial, [
                    this.research.id,
                    this.newContentProposal.type,
                    this.newContentProposal.title,
                    this.newContentProposal.title.replace(/[^a-zA-Z0-9-_]+/ig,''),
                    hash,
                    this.newContentProposal.authors,
                    [],
                    []
                ]);

                // todo: add this proposal to appropriate Vuex state
                deipRpc.broadcast.createProposalAsync(
					this.user.privKey,
					this.user.username, 
					this.research.research_group_id, 
					proposal,
                    proposalService.types.createResearchMaterial,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.$refs.newContent.removeAllFiles();
                    this.newContentProposal.isInProgress = false;
                    this.newContentProposal.isOpen = false;
                }, (err) => {
                    this.newContentProposal.isInProgress = false;
                    this.newContentProposal.isOpen = false;
                    alert(err.message);
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    #content-dropzone {
        margin-left: -1px;
        margin-right: -1px;
    }

    .new-content-dialog-body{
        min-height: 300px !important;
    }

    .review-left-block {
        width: 160px;
        min-width: 160px;
    }
    
    .loader {
        position: absolute;
        right: 45%;
        top: 45%;
    }
</style>
