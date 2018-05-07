<template>
    <div>
        <div class="row justify-between align-center">
            <div>
                <v-icon size="18px">date_range</v-icon>
                <span v-if="research">Created on {{ new Date(research.created_at).toDateString() }}</span>
            </div>
           <!-- <v-btn @click="afterComplete" small color="primary" class="ma-0">Vote</v-btn> -->
        </div>

        <div class="display-1 half-bold c-mt-10">
            {{ research.title }}
        </div>

        <div class="c-pt-8">
            {{ research.abstract }}
        </div>

        <div class="c-pt-8 title">Timeline</div>

        <div class="c-pt-6">
            <research-timeline :contentList="contentList" :research="research"></research-timeline>
        </div>

        <div class="c-pt-8 title">Research</div>

        <div class="c-pt-6">
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(content, index) in contentList">
                    <div slot="header">
                        <span class="bold">Chapter {{index + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"> 
                            <router-link  :to="`/researchDetails/${research.id}/${content.id}`" 
                                          
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
            <vue-dropzone v-if="!research.is_finished" ref="newContent" id="content-dropzone" :options="dropzoneOptions" 
                @vdropzone-file-added="fileAdded"
                @vdropzone-complete="afterComplete">
            </vue-dropzone>

            <v-dialog v-model="newContentProposal.isOpen" persistent max-width="500px">
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

      <!--  <div class="c-pt-8 title">Reviews: 2</div>

        <div class="c-pt-6">
            <v-card>
                <div class="row-nowrap c-p-6">
                    <div class="review-left-block text-align-center">
                        <v-avatar size="90px">
                            <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                        </v-avatar>
                        <div class="bold c-pt-2">Serge Dzeranov</div>
                        <v-btn class="ma-0 mt-2" block color="primary">Vote</v-btn>
                    </div>
                    <div class="c-ml-6">
                        <div>
                            <span class="grey--text">20 Jan 2018</span>
                            <span class="c-pl-2 green--text text--darken-3">Positive</span>
                        </div>
                        <div class="c-pt-4">
                            Collaboratively brand bricks-and-clicks services for clicks-and-mortar bandwidth. Intrinsicly 
                            underwhelm state of the art infrastructures via premier methods of empowerment. Holisticly 
                            procrastinate exceptional metrics for market positioning human capital. Monotonectally 
                            syndicate turnkey total linkage and cost effective portals. Competently e-enable professional 
                            markets and premier testing procedures. seamless ROI. Authoritatively monetize leading-edge 
                            users through dynamic core competencies. Quickly drive error-free data with premium benefits. 
                            Credibly simplify B2C content rather than magnetic catalysts for change.
                        </div>
                        <div class="c-pt-4 grey--text">
                            Quantum Optics 21 |  Physics  8787    
                        </div>
                    </div>
                </div>

                <v-divider></v-divider>

                <div class="row-nowrap c-p-6">
                    <div class="review-left-block text-align-center">
                        <v-avatar size="90px">
                            <img src="http://deip.world/static/aermolaev.bf4059ea.png" alt="User">
                        </v-avatar>
                        <div class="bold c-pt-2">Serge Dzeranov</div>
                        <v-btn class="ma-0 mt-2" block color="primary">Vote</v-btn>
                    </div>
                    <div class="c-ml-6">
                        <div>
                            <span class="grey--text">20 Jan 2018</span>
                            <span class="c-pl-2 green--text text--darken-3">Positive</span>
                        </div>
                        <div class="c-pt-4">
                            Collaboratively brand bricks-and-clicks services for clicks-and-mortar bandwidth. Intrinsicly 
                            underwhelm state of the art infrastructures via premier methods of empowerment. Holisticly 
                            procrastinate exceptional metrics for market positioning human capital. Monotonectally 
                            syndicate turnkey total linkage and cost effective portals. Competently e-enable professional 
                            markets and premier testing procedures. seamless ROI. Authoritatively monetize leading-edge 
                            users through dynamic core competencies. Quickly drive error-free data with premium benefits. 
                            Credibly simplify B2C content rather than magnetic catalysts for change.
                        </div>
                        <div class="c-pt-4 grey--text">
                            Quantum Optics 21 |  Physics  8787    
                        </div>
                    </div>
                </div>
            </v-card>
        </div>

        <div class="row c-pt-4 justify-end">
            <v-btn class="ma-0" color="primary">
                <v-icon>add</v-icon> Add a review
            </v-btn>
        </div>

        <div class="c-pt-4 title">Grants: 4</div>

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

        <div class="c-pt-8 title">References: 4</div>

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

    import vueDropzone from 'vue2-dropzone';
    import {getAccessToken} from './../../../../utils/auth'
    import config from './../../../../../src/config'

    export default {
        name: "ResearchDetailsBody",
        components: {
            vueDropzone
        },
        props: {
            research: { required: true, type: Object, default: null },
            contentList: { required: true, type: Array, default: [] },
            membersList: { required: true, type: Array, default: [] },
            disciplinesList: { required: true, type: Array, default: [] },
            totalVotesList: { required: true, type: Array, default: [] }
        },
        data() {
            return {

                dropzoneOptions: {
                    url: `${config['deip-server-url']}/api/files/upload-content`,

                    paramName : "research-content",
                    headers: { 
                        "Research-Id": this.$route.params.research_id,
                        "Authorization": 'Bearer ' + getAccessToken()
                    },
                    maxFiles: 1,
                    thumbnailWidth: 150,
                    autoProcessQueue: false,
                    acceptedFiles: ['application/pdf', 'image/png', 'image/jpeg'].join(',')
                },

                newContentProposal: {
                    title: "",
                    type: null,
                    authors: [],
                    isInProgress: false,
                    isOpen: false
                },

                contentTypes: [
                    { text: 'Announcement', id: 1 },
                    { text: 'Milestone', id: 2 },
                    { text: 'Final Result', id: 3 }
                ],

                user: { name: 'initdelegate', postingWif: '5JidFW79ttL9YP3W2Joc5Zer49opYU3fKNeBx9B6cpEH1GiDm5p' }
            }
        },

        computed: {
            authors: function(){
                return this.membersList.map(m => {return { text: m.owner, id: m.id }});
            },
            newContentBtnIsEnabled: function(){
                return  this.newContentProposal.title && 
                        this.newContentProposal.type && 
                        this.newContentProposal.authors.length
            },

            contentWeightByDiscipline: function() {
                const map = {};
                const flattened = this.totalVotesList.reduce(
                        function(accumulator, currentValue) {
                            return accumulator.concat(currentValue);
                        }, []);

                for (var i = 0; i < flattened.length; i++) {
                    const tvo = flattened[i];
                    const discipline_id = tvo.discipline_id.toString();
                    const research_content_id = tvo.research_content_id.toString();
                    const total_research_reward_weight = tvo.total_research_reward_weight;

                    if(map[research_content_id] === undefined) 
                        map[research_content_id] = {};

                    map[research_content_id][discipline_id] = total_research_reward_weight;
                }
                return map;
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
                const proposeNewContentAction = 11;

				const proposal = `{"research_id": ${this.research.id}, 
                        "type": ${this.newContentProposal.type}, 
                        "title": "${this.newContentProposal.title}", 
                        "content": "${hash}", 
                        "authors": [${'"' + this.newContentProposal.authors.join('","') + '"'}], 
                        "references": [], 
                        "external_references": []}`;

                deipRpc.broadcast.createProposalAsync(
					this.user.postingWif,
					this.user.name, 
					this.research.research_group_id, 
					proposal,
                    proposeNewContentAction,
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
        },
        mounted() {
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
