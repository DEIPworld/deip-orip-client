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

                    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Roadmap</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="5">
                        <div class="uppercase">Review share</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-pick-discipline
                                @incStep="incStep"
                                @selectDiscipline="setDiscipline"
                            ></create-research-pick-discipline>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-pick-group
                                @incStep="incStep" @decStep="decStep"
                                @selectGroup="setGroup"
                            ></create-research-pick-group>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-meta
                                @incStep="incStep" @decStep="decStep"
                                @selectMeta="setMeta"
                            ></create-research-meta>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-roadmap
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-roadmap>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="5">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-share 
                                :isLoading="isLoading"
                                @finish="finish" @decStep="decStep"
                                @selectReviewShare="setReviewShare"
                            ></create-research-share>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

        </v-layout>
    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchCreating",
        data() { 
            return {
                currentStep: 0,
                newResearch: {
                    disciplines: [],
                    group: undefined,
                    title: '',
                    description: '',
                    review_share_in_percent: 5,
                },

                isLoading: false
            } 
        },
        computed: {
            ...mapGetters({
                user: 'user',
                userGroups: 'userGroups',
                userCoworkers: 'userCoworkers'
            })
        },
        methods: {
            incStep() {
                if (this.currentStep < 5) {
                    this.currentStep++;
                } else {
                    this.currentStep = 1;
                }
            },
            decStep() {
                this.currentStep--;
            },

            setDiscipline(disciplines){
                this.newResearch.disciplines = disciplines;
            },

            setGroup(group){
                this.newResearch.group = group;
            },

            setMeta(meta){
                this.newResearch.title = meta.title;
                this.newResearch.description = meta.description;
            },

            setReviewShare(share){
                this.newResearch.review_share_in_percent = share;
            },

            finish(){

                this.isLoading = true;

                var proposal = `{"research_group_id": ${this.newResearch.group.id}, 
                    "title": "${this.newResearch.title}", 
                    "abstract":"${this.newResearch.description}", 
                    "permlink":"${this.newResearch.title.replace(/[^a-zA-Z0-9-_]+/ig,'')}", 
                    "review_share_in_percent": ${this.newResearch.review_share_in_percent}, 
                    "dropout_compensation_in_percent": 5, 
                    "disciplines": [${this.newResearch.disciplines.map(d => d.id).join(', ')}]}`;
                    
                deipRpc.broadcast.createProposalAsync(
					this.user.privKey,
					this.user.username, 
					this.newResearch.group.id,
                    proposal,
                    1,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.isLoading = false;
                    alert("success")
                    this.$router.push(`/${this.newResearch.group.permlink}/group-details`)

                }, (err) => {
                    this.isLoading = false;
                    alert(err.message);
                });
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
        padding-bottom: 16px;
    }
</style>
