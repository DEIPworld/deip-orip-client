<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Title</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Description</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Members</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Tokens</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <create-research-group-title
                                @incStep="incStep"
                                :group-info="groupInfo"
                            ></create-research-group-title>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <create-research-group-description
                                @incStep="incStep" @decStep="decStep"
                                :group-info="groupInfo"
                            ></create-research-group-description>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <create-research-group-members
                                @incStep="incStep" @decStep="decStep"
                                :group-info="groupInfo"
                            ></create-research-group-members>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-group-share
                                @finish="finish" @decStep="decStep"
                                :group-info="groupInfo"
                                :isLoading="isLoading"
                            ></create-research-group-share>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-layout>
    </v-container>   
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc';

    export default {
        name: "ResearchGroupCreating",
        data() { 
            return {
                currentStep: 0,
                groupInfo: {
                    title: '',
                    permlink: '',
                    description: '',
                    members: [{ name: this.$route.params.account_name, stake: 100 }]
                },
                isLoading: false
            } 
        },
        computed: {
            ...mapGetters({
                user: 'user'
            })
        },
        methods: {
            incStep() { this.currentStep++; },
            decStep() { this.currentStep--; },
            finish() {

                this.isLoading = true;
                const permlink = this.groupInfo.title.replace(/\s+/g, '-').toLowerCase();
                const invitees = this.groupInfo.members.filter(m => m.name != this.user.username)
                    .map(m => {
                        return { account: m.name, research_group_tokens_in_percent: m.stake * this.DEIP_1_PERCENT }
                    })

                deipRpc.broadcast.createResearchGroupAsync(
                    this.user.privKey,
                    this.user.username,
                    this.groupInfo.title,
                    permlink,
                    this.groupInfo.description,
                    600,
                    false,
                    invitees
                ).then(() => {
                    this.isLoading = false;
                    this.$router.push({ 
                        name: 'ResearchGroupDetails', 
                        params: { research_group_permlink: permlink }
                    }); 
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
