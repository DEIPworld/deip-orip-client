<template>
    <div class="research-content-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchContentPage"></sidebar-loader>
      <div v-if="isLoadingResearchContentPage === false">

        <!-- ### START Research Content Details Section ### -->
        <div class="research-content-info-container">
            <div v-if="isLoadingResearchContentPage === false && content">
                <div class="sm-title bold">Content Info</div>
                <div class="c-pb-6 c-pt-4">
                    <div v-for="(discipline, index) in disciplinesList" class="row align-center justify-between vote-btn-area" :class="index == 0 ? '':'c-mt-1'">
                        <div class="deip-blue-color c-p-2">
                            {{discipline.name}}:  
                
                            {{contentWeightByDiscipline[content.id] !== undefined && 
                            contentWeightByDiscipline[content.id][discipline.id] !== undefined ?
                            contentWeightByDiscipline[content.id][discipline.id] : 0}}
                        </div>
                        
                        <!-- TODO: add voting for review -->
                        <v-btn v-if="!isResearchGroupMember && userHasExpertise(discipline)" @click="openVote(discipline)" small color="primary" dark class="ma-0" >Vote</v-btn>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content Details Section ### -->

        <!-- ### START Draft Actions Section ### -->
        <div v-if="isLoadingResearchContentPage === false 
                    && !content && isResearchGroupMember" class="research-content-info-container">
            <div>
                <div class="c-pb-6 text-align-center">
                    <v-btn @click="openContentProposalDialog()" color="primary" class="ma-0" block outline>Propose Content</v-btn>
                </div>
                <div class="c-pb-6 text-align-center">
                    <v-btn @click="saveDraft()" color="secondary" class="ma-0" block outline>Save Draft</v-btn>
                </div>
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
                                    :disabled="proposeContent.isDisabled || proposeContent.isLoading"
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
                }
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
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
        },

        methods: {
            saveDraft() {
                const texture = this.$store.getters['rcd/texture'];
                texture.save();
                this.$store.dispatch('layout/setSuccess', {
                    message: "Draft Saved !"
                });
            },

            sendContentProposal() {
                const self = this;
                const texture = this.$store.getters['rcd/texture'];
                texture.save();

                self.proposeContent.isLoading = true;
                setTimeout(() => {
                    // wait for saving
                    darService.getDraftMeta(self.$route.query.darRef)
                        .then((res) => {
                            console.log(res);
                            const hash = res.hash;
                            const title = res.title;
                            const permlink = title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase();
                            const content = `dar:${hash}`
                            const type = this.proposeContent.type;
                            const authors = this.proposeContent.authors.map(a => a.account.name);

                            const proposal = 
                                proposalService.getStringifiedProposalData(
                                    proposalService.types.CREATE_RESEARCH_MATERIAL, [
                                    self.research.id, type, title, permlink, 
                                    content, authors, [], []
                                ]);

                            return deipRpc.broadcast.createProposalAsync(self.user.privKey, self.user.username,  self.research.research_group_id, 
					            proposal, proposalService.types.CREATE_RESEARCH_MATERIAL, new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 ))
                        })
                        .then(() => {
                                self.$store.dispatch('layout/setSuccess', {
                                    message: "New Content Proposal has been created successfuly!"
                                });
                                setTimeout(() => {
                                    self.$router.push({ 
                                        name: 'ResearchGroupDetails',
                                        params: { research_group_permlink: self.$route.params.research_group_permlink  }
                                    }); 
                                }, 1500);

                            }, (err) => {
                                self.$store.dispatch('layout/setError', {
                                    message: "An error occurred while creating proposal, please try again later"
                            });
                            console.log(err) 
                         })
                        .finally(() => {
                            self.proposeContent.isOpen = false;
                            self.proposeContent.isLoading = false;
                        });
                }, 5000)
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
