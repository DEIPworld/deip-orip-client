<template>
    <div class="research-content-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchContentPage"></sidebar-loader>
      <div v-if="isLoadingResearchContentPage === false">

        <!-- ### START Research Content Details Section ### -->
        <div class="research-content-info-container">
            <div v-if="isLoadingResearchContentPage === false && content">
                <div class="c-mb-2" v-if="research">
                    <router-link class="a sm-title" :to="{ 
                        name: 'research-details', 
                        params: { 
                            research_group_permlink: research.group_permlink,
                            research_permlink: research.permlink
                        }
                    }">{{ research.title }}</router-link>
                </div>

                <div class="sm-title bold">Content Info</div>

                <div class="c-pb-6 c-pt-4">
                    <div v-for="(discipline, index) in disciplinesList" :key="index"
                        class="row align-center justify-between vote-btn-area" 
                        :class="index === 0 ? '' : 'c-mt-1'"
                    >
                        <div class="deip-blue-color c-p-2">
                            {{discipline.name}}:  
                
                            {{contentWeightByDiscipline[content.id] !== undefined && 
                            contentWeightByDiscipline[content.id][discipline.id] !== undefined ?
                            contentWeightByDiscipline[content.id][discipline.id] : 0}}
                        </div>
                        
                        <!-- TODO: add voting for review -->
                        <!-- <v-btn v-if="!isResearchGroupMember && userHasExpertise(discipline)" @click="openVote(discipline)" small color="primary" dark class="ma-0" >Vote</v-btn> -->
                    </div>

                    <div class="c-mt-6">
                        <router-link class="a sm-title" :to="{ 
                            name: 'ResearchContentMetadata', 
                            params: { 
                                research_group_permlink: research.group_permlink,
                                research_permlink: research.permlink,
                                content_permlink: content.permlink
                            }
                        }">Metadata</router-link>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content Details Section ### -->

        <!-- ### START Draft Actions Section ### -->
        <div v-if="isLoadingResearchContentPage === false 
                    && !content 
                    && isResearchGroupMember 
                    && isInProgress" class="research-content-info-container">
            <div>
                <div class="c-pb-6 text-align-center">
                    <v-btn @click="openContentProposalDialog()" color="primary" class="ma-0" block outline>Propose Content</v-btn>
                </div>
                <div class="c-pb-6 text-align-center">
                    <v-btn @click="saveDraft()" :loading="isSavingDraft" :disabled="isSavingDraft" 
                        color="secondary" class="ma-0" block outline>
                        Save Draft
                    </v-btn>
                </div>
            </div>
        </div>
        <div v-if="isLoadingResearchContentPage === false 
                    && !content 
                    && isResearchGroupMember 
                    && !isInProgress" class="research-content-info-container">
            <div>
                <p>Draft is proposed for content and locked for editing</p>
            </div>
        </div>
        <!-- ### END Draft Actions Section ### -->

    <!--<div class="section-divider">
            <v-divider></v-divider>
        </div> -->
      </div>

      <v-dialog v-if="research" v-model="proposeContent.isOpen" persistent transition="scale-transition" max-width="500px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeContentProposalDialog()">
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
                                v-model="proposeContent.title"
                                hide-details>
                            </v-text-field>

                            <v-select v-model="proposeContent.type" 
                                :items="proposeContent.contentTypes" 
                                label="Content Type" 
                                class="c-mt-6"
                                item-value="id">
                            </v-select>

                            <v-select
                                :items="membersList"
                                v-model="proposeContent.authors"
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


                            <div class="display-flex c-pt-8">
                                <v-btn color="primary" 
                                    class="c-m-auto"
                                    :disabled="proposeContent.isLoading"
                                    :loading="proposeContent.isLoading"
                                    @click="sendContentProposal()"
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
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import darService from './../../../services/dar'
    import * as proposalService from "./../../../services/ProposalService";
    import { signOperation } from './../../../utils/blockchain';

    export default {
        name: "ResearchContentDetailsSidebar",
        data() {
            return {
                vote: {
                    discipline: {},
                    weight: 50,
                    isLoading: false,
                    isOpen: false
                },
                proposeContent: {
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
                    isLoading: false
                },

                isSavingDraft: false
            };
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                membersList: 'rcd/membersList',
                disciplinesList: 'rcd/disciplinesList',
                totalVotesList: 'rcd/totalVotesList',
                contentWeightByDiscipline: 'rcd/contentWeightByDiscipline',
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage',
                darRef: 'rcd/darRef'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            isInProgress() {
                return this.darRef && this.darRef.status == 'in-progress';
            }
        },

        methods: {
            saveDraft() {
                this.isSavingDraft = true;
                const texture = this.$store.getters['rcd/texture'];

                darService.getDraftMeta(this.$route.query.darRef)
                    .then((draft) => {
                        return draft.status == 'in-progress' ? 
                            texture.save()
                                .then(() => {
                                    this.$store.dispatch('layout/setSuccess', {
                                        message: "Draft Saved !"
                                    });
                                }) : Promise.resolve().then(() => {
                                    this.$store.dispatch('layout/setError', {
                                        message: "Draft is locked for editing !"
                                    });
                                })
                    })
                    .finally(() => {
                        this.isSavingDraft = false;
                    });
            },

            sendContentProposal() {
                const texture = this.$store.getters['rcd/texture'];
                this.proposeContent.isLoading = true;
                texture.save()
                    .then(() => {
                        return darService.getDraftMeta(this.$route.query.darRef)
                    })
                    .then((res) => {
                        console.log(res);
                        const hash = res.hash;
                        const title = res.title || this.proposeContent.title;
                        const permlink = title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase();
                        const content = `dar:${hash}`
                        const type = this.proposeContent.type;
                        const authors = this.proposeContent.authors.map(a => a.account.name);

                        const proposal = proposalService.getStringifiedProposalData(
                                proposalService.types.CREATE_RESEARCH_MATERIAL, [
                                this.research.id, type, title, permlink, 
                                content, authors, [], []
                            ]);

                        const operation = ["create_proposal", {
                                creator: this.user.username,
                                research_group_id: this.research.research_group_id,
                                data: proposal,
                                action: proposalService.types.CREATE_RESEARCH_MATERIAL,
                                expiration_time: new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
                            }];

                        return signOperation(operation, this.user.privKey)
                            .then((signedTX) => {
                                return darService.createDarContentProposal(res._id, signedTX)
                            })
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
                        })

            },

            userHasExpertise(discipline) {
                return this.userExperise != null && this.research != null
                    ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
                    : false
            },
            openVote(discipline) {
                this.vote.discipline = discipline;
                this.vote.isOpen = true;
            },
            cancelVote() {
                this.vote.isOpen = false;
            },

            openContentProposalDialog() {
                const texture = this.$store.getters['rcd/texture'];
                const articleTitle = texture.api.getArticleTitle();
                var title;
                try {
                    title = articleTitle['_node']['content']
                } catch(err) {
                    title = "";
                }
                this.proposeContent.title = title;
                this.proposeContent.isOpen = true;
            },

            closeContentProposalDialog() {
                this.proposeContent.isOpen = false;
            },

            isAuthorSelected(item) {
                return this.proposeContent.authors.find(author => { return author.account.name == item.account.name }) !== undefined;
            }
        }
    };
</script>

<style lang="less" scoped>
    .vote-btn-area {
        border: 1px solid #2F80ED;
        border-radius: 3px;
    }

    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }

    .section-divider {
        margin: 0 -24px;
    }

</style>
