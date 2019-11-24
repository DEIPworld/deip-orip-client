<template>
                <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="600px">
                    <v-card class="pa-4">
                    <v-card-title>
                        <span class="headline">Invite user to Research Group</span>
                    </v-card-title>
                    <v-card-text>
                        <v-autocomplete
                            :items="users"
                            v-model="selectedUser"
                            placeholder="Researcher"
                        >
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
                                <div class="legacy-row-nowrap align-center">
                                    <v-avatar size="30px">
                                        <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(60, 60, false)" />
                                        <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <span class="deip-blue-color c-pl-3">{{ data.item | fullname }}</span>
                                </div>
                            </template>
                        </v-autocomplete>

                        <v-text-field
                            label="Research Group Tokens"
                            v-model="tokensAmount"
                            suffix="%"
                            mask="###"
                        ></v-text-field>

                        <v-textarea
                            label="Invitation letter" 
                            auto-grow
                            rows="2"
                            v-model="coverLetter"
                        ></v-textarea>
                    </v-card-text>

                    <v-card-actions>
                        <v-layout column>
                            <v-btn 
                                color="primary" 
                                class="mx-0 my-1 pa-0"
                                :disabled="isDisabled || isLoading"
                                :loading="isLoading"
                                @click="sendProposal()"
                            >Create proposal</v-btn>

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
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { mapGetters } from 'vuex';
    import { createInviteProposal } from './../../../services/ProposalService';
    import { getEnrichedProfiles } from './../../../utils/user'

    export default {
        name: "AddMemberToGroupDialog",
        props: {
            isOpen: { required: true, type: Boolean },
            groupId: { required: true, type: Number },
            users: { required: true, type: Array, default: () => [] },
        },
        computed: {
            isDisabled() {
                return _.isEmpty(this.selectedUser) 
                    || _.isEmpty(this.tokensAmount) 
                    || !_.isNumber( parseInt(this.tokensAmount) );
            }
        },
        data() { 
            return {
                selectedUser: undefined,
                tokensAmount: '',
                coverLetter: '',
                isLoading: false
            }
        },
        methods: {
            close() {
                this.$emit('onClose');
            },

            sendProposal() {
                this.isLoading = true;
                
                createInviteProposal(
                    this.groupId,
                    this.selectedUser.account.name,
                    parseInt(this.tokensAmount) * this.DEIP_1_PERCENT,
                    this.coverLetter
				).then(() => {
                    this.$store.dispatch('layout/setSuccess', {
                        message: "Invitation Proposal has been created successfully!"
                    });
                    this.$emit('onSuccess');
                }).catch(err => {
                    this.$store.dispatch('layout/setError', {
                        message: "An error occurred while creating proposal, please try again later"
                    });
                    console.log(err)
                }).finally(() => {
                    this.isLoading = false;
                    this.close();
                });
            }
        },
        watch: {
            isOpen(newVal, oldVal) {
                this.selectedUser = undefined;
                this.tokensAmount = '';
                this.coverLetter = '';
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
