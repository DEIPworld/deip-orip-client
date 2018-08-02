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

                    <v-stepper-step step="4" :complete="currentStep > 3">
                        <div class="uppercase">Quorum</div>
                    </v-stepper-step>
                    
                    <v-divider></v-divider>

                    <v-stepper-step step="5" :complete="currentStep > 4">
                        <div class="uppercase">Tokens</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <create-research-group-title
                                @incStep="incStep"
                                :group="group"
                                @setName="setName"
                                @setPermlink="setPermlink"
                            ></create-research-group-title>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <create-research-group-description
                                @incStep="incStep" @decStep="decStep"
                                @setDescription="setDescription"
                                :group="group"
                            ></create-research-group-description>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <create-research-group-members
                                @incStep="incStep" @decStep="decStep"
                                @setGroupMembers="setGroupMembers"
                                :group="group"
                            ></create-research-group-members>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-group-quorum
                                @incStep="incStep" @decStep="decStep"
                                :group="group"
                            ></create-research-group-quorum>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="5">
                        <div class="full-height">
                            <create-research-group-share
                                @finish="finish" @decStep="decStep"
                                :group="group"
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
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "CreateResearchGroup",
        data() { 
            return {
                currentStep: 0,
                group: {
                    name: "",
                    permlink: "",
                    description: "",
                    members: []
                },
                isLoading: false
            } 
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        methods: {
            incStep() { this.currentStep++; },
            decStep() { this.currentStep--; },

            setName(name){
                this.group.name = name;
            },
            setPermlink(permlink){
                this.group.permlink = permlink;
            },
            setDescription(description){
                this.group.description = description;
            },
            setGroupMembers(members){
                this.group.members = members;
            },

            finish() {
                const self = this;

                this.isLoading = true;
                const invitees = this.group.members.filter(m => m.account.name != this.user.username)
                    .map(m => {
                        return { account: m.account.name, research_group_tokens_in_percent: m.stake * this.DEIP_1_PERCENT }
                    })

                deipRpc.broadcast.createResearchGroupAsync(
                    this.user.privKey,
                    this.user.username,
                    this.group.name,
                    this.group.permlink,
                    this.group.description,
                    600,
                    false,
                    invitees
                ).then(() => {
                    this.isLoading = false;
                    this.$store.dispatch('auth/loadGroups'); // reload user groups
                    this.$store.dispatch('layout/setSuccess', {
                        message: `"${this.group.name}" research group has been created successfully !`
                    });

                    setTimeout(() => {
                        self.$router.push({ 
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: this.group.permlink }
                        }); 
                    }, 1500)

                }, (err) => {
                    this.isLoading = false;
                    this.$store.dispatch('layout/setError', {
                        message: "An error occurred while creating Research Group, please try again later"
                    });
                    console.log(err)
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
