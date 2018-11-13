<template>
    <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="700px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Invite a researcher</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <page-container>
                <contentbar>

                    <div v-if="allUsers">
                        <v-select
                            :items="allUsers"
                            v-model="selectedUser"
                            placeholder="Researcher"
                            autocomplete
                        >
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
                                <div class="row-nowrap align-center">
                                    <v-avatar size="30px">
                                        <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(30, 30, false)" />
                                        <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <span class="deip-blue-color c-pl-3">{{ data.item | fullname }}</span>
                                </div>
                            </template>
                        </v-select>

                        <v-text-field
                            label="Research Group Tokens"
                            v-model="tokensAmount"
                            suffix="%"
                            mask="###"
                        ></v-text-field>

                        <v-text-field
                            label="Cover letter" 
                            multi-line auto-grow
                            rows="3"
                            v-model="coverLetter"
                        ></v-text-field>

                        <div class="display-flex c-pt-8">
                            <v-btn color="primary" 
                                class="c-m-auto"
                                :disabled="isDisabled || isLoading"
                                :loading="isLoading"
                                @click="sendProposal()"
                            >Create proposal</v-btn>
                        </div>
                    </div>

                    <div class="display-flex" v-else>
                        <v-progress-circular class="c-m-auto" indeterminate color="primary"></v-progress-circular>
                    </div>
                
                </contentbar>
            </page-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import { createInviteProposal } from './../../../services/ProposalService';
    import { getEnrichedProfiles } from './../../../utils/user'

    export default {
        name: "AddMemberToGroupDialog",
        props: {
            isOpen: { required: true, type: Boolean },
            groupId: { required: true, type: Number },
            groupMembers: { required: true, type: Array }
        },
        computed: {
            isDisabled() {
                return _.isEmpty(this.selectedUser) 
                    || _.isEmpty(this.tokensAmount) 
                    || !_.isNumber( parseInt(this.tokensAmount) );
            },
            ...mapGetters({
                user: 'auth/user'
            })
        },
        data() { 
            return {
                allUsers: undefined,

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
                if (newVal) {
                    this.selectedUser = undefined;
                    this.tokensAmount = '';
                    this.coverLetter = '';

                    deipRpc.api.getAllAccountsAsync()
                        .then(accounts => {
                            const invitees = accounts.filter(a => !this.groupMembers.some(m => m.account.name == a.name )).map(a => a.name);
                            return getEnrichedProfiles(invitees)
                        })
                        .then((users) => {
                             this.allUsers = users;
                        })
                } else {
                    this.allUsers = undefined;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .dialog.dialog--active {
        overflow: visible;
    }
</style>
