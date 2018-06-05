<template>
    <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="500px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Invite a researcher</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <div class="column-page">
                <div class="content-column">
                    <div class="filling">
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
                                            <v-gravatar :email="data.item + '@deip.world'" />
                                        </v-avatar>
                                        <span class="deip-blue-color c-pl-3">{{ data.item }}</span>
                                    </div>
                                </template>
                                
                                <template slot="item" slot-scope="data">
                                    <template>
                                        <div class="row-nowrap align-center">
                                            <v-avatar size="30px">
                                                <v-gravatar :email="data.item + '@deip.world'" />
                                            </v-avatar>
                                            <span class="deip-blue-color c-pl-3">{{ data.item }}</span>
                                        </div>
                                    </template>
                                </template>
                            </v-select>

                            <v-text-field
                                label="Group tokens amount"
                                v-model="tokensAmount"
                                suffix="%"
                                mask="###"
                                hide-details
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
                    </div>
                </div>
            </div>

            <v-snackbar :timeout="4000" color="error" v-model="isError">
                Error
                <v-btn dark flat @click.native="isError = false">Close</v-btn>
            </v-snackbar>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex';
    import * as proposalService from '../../services/ProposalService';

    export default {
        name: "AddResearchReviewDialog",
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
                user: 'user'
            })
        },
        data() { 
            return {
                allUsers: undefined,

                selectedUser: undefined,
                tokensAmount: undefined,

                isLoading: false,
                isError: false
            }
        },
        methods: {
            close() {
                this.$emit('onClose');
            },

            sendProposal() {
                this.isLoading = true;

                let proposal = proposalService.getStringifiedProposalData(
                    proposalService.types.inviteMember, [
                        this.groupId,
                        this.selectedUser,
                        parseInt(this.tokensAmount) * this.DEIP_1_PERCENT
                    ]
                );

                deipRpc.broadcast.createProposalAsync(
					this.user.privKey,
					this.user.username, 
					this.groupId,
					proposal,
                    proposalService.types.inviteMember,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.$emit('onSuccess');
                    this.close();
                }).catch(err => {
                    this.isError = true;
                }).finally(() => {
                    this.isLoading = false;
                });
            }
        },
        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.selectedUser = undefined;
                    this.tokensAmount = undefined;

                    deipRpc.api.getAllAccountsAsync().then(data => {
                        this.allUsers = _.map(data, "name").filter(name => !_.find(this.groupMembers, { 'name': name }))
                    });
                } else {
                    this.allUsers = undefined;
                }
            }
        }
    };
</script>

<style lang="less">
    .dialog.dialog--active {
        overflow: visible;
    }
</style>
