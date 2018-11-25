<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>

            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Discipline</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Research group</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Title</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

            <!--    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Roadmap</div>
                    </v-stepper-step>
                    
                    <v-divider></v-divider> -->

                    <v-stepper-step step="4">
                        <div class="uppercase">Reward shares</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <create-research-pick-discipline
                                @incStep="incStep"
                                @setDisciplines="setDisciplines"
                                :research="research"
                            ></create-research-pick-discipline>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <create-research-pick-group
                                @incStep="incStep" @decStep="decStep"
                                @setGroup="setGroup"
                                :research="research"
                            ></create-research-pick-group>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <create-research-meta
                                @incStep="incStep" @decStep="decStep"
                                @setTitle="setTitle"
                                @setDescription="setDescription"
                                :research="research"
                            ></create-research-meta>
                        </div>
                    </v-stepper-content>

            <!--    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-roadmap
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-roadmap>
                        </div>
                    </v-stepper-content> -->

                    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-share 
                                @finish="finish" @decStep="decStep"
                                @setReviewShare="setReviewShare"
                                :research="research"
                                :isLoading="isLoading"
                            ></create-research-share>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-layout>
    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { createResearchProposal } from "./../../services/ProposalService"; 
    import * as disciplineTreeService from "./../common/disciplines/DisciplineTreeService"; 
    import { mapGetters } from 'vuex';

    export default {
        name: "CreateNewResearch",

        data() { 
            return {
                currentStep: 0,
                isLoading: false,

                research: {
                    disciplines: [],
                    group: undefined,
                    title: '',
                    description: '',
                    review_share_in_percent: 5,
                }
            } 
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                userCoworkers: 'auth/userCoworkers'
            })
        },

        methods: {
            incStep() {
                this.currentStep++;
            },
            decStep() {
                this.currentStep--;
            },

            setDisciplines(disciplines){
                this.research.disciplines = disciplines;
            },

            setGroup(group){
                this.research.group = group;
            },

            setTitle(title) {
                 this.research.title = title;
            },

            setDescription(description) {
                 this.research.description = description;
            },

            setReviewShare(share){
                this.research.review_share_in_percent = share;
            },

            finish() {
                const self = this;
                this.isLoading = true;
                
                createResearchProposal(
                    this.research.group.id, this.research.title, this.research.description, 
                    this.research.title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase(), 
                    this.research.review_share_in_percent * this.DEIP_1_PERCENT,
                    this.research.disciplines.map(d => d.id)
                ).then(() => {
                    this.isLoading = false;
                    this.$store.dispatch('layout/setSuccess', {
                        message: `Proposal for "${this.research.title}" research is created !`
                    });
                }, (err) => {
                    this.isLoading = false;
                    
                    this.$store.dispatch('layout/setError', {
                        message: "An error occurred while creating proposal, please try again later"
                    });

                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        self.$router.push({ name: 'ResearchFeed' });
                    }, 1500);
                });
            }
        },

        created() {
            if (this.$route.query['disciplineIds'] && _.isArray(this.$route.query['disciplineIds'])) {
                try {
                    this.research.disciplines = disciplineTreeService.getNodesByIdList(
                        this.$route.query['disciplineIds'].map(disciplineId => parseInt(disciplineId))
                    );

                    this.currentStep = 2;
                } catch (e) {
                    console.error('Invalid url params');
                }
            }
        }
    };
</script>

<style lang="less">    
    .stepper__content {
        height: 100%;
        padding-right: 0px;
        padding-left: 0px;
        .stepper__wrapper {
            height: 100%;
        }
    }

    .step-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 10px;
    }
</style>
