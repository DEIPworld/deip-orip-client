<template>
    <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="700px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Join request</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <page-container>
                <contentbar>
                    <div class="c-pb-4" v-if="joinRequest">
                        <v-avatar size="40px">
                            <img v-if="joinRequest.user.profile" v-bind:src="joinRequest.user.profile.avatar | avatarSrc(40, 40, false)" />
                            <v-gravatar v-else :title="joinRequest.user.account.name" :email="joinRequest.user.account.name + '@deip.world'" />
                        </v-avatar>

                        <span class="half-bold c-pl-3">{{ joinRequest.user | fullname }}</span>
                    </div>

                    <v-text-field
                        label="Research Group Tokens"
                        v-model="tokensAmount"
                        suffix="%"
                        mask="###"
                    ></v-text-field>

                    <v-textarea
                        label="Cover letter"
                        :disabled="true"
                        v-model="coverLetter"
                    ></v-textarea>

                    <div class="display-flex c-pt-8">
                        <div class="c-m-auto">
                            <v-btn color="primary"
                                :disabled="isApprovingDisabled || isApprovingLoading"
                                :loading="isApprovingLoading"
                                @click="sendProposal()"
                            >Approve and create proposal</v-btn>

                            <v-btn color="error" flat
                                @click="denyJoinRequest()"
                                :loading="isDenyingLoading"
                                :disabled="isDenyingLoading"
                            >Deny</v-btn>
                        </div>
                    </div>
                </contentbar>
            </page-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { mapGetters } from 'vuex';
    import { createInviteProposal } from './../../../services/ProposalService';
    import { signOperation } from './../../../utils/blockchain';
    import joinRequestsService from './../../../services/http/joinRequests'
    import { getEnrichedProfiles } from './../../../utils/user';

    export default {
        name: "HandleJoinRequestDialog",
        props: {
            isOpen: { required: true, type: Boolean },
            groupId: { required: true, type: Number },
            joinRequest: {
                required: true,
                validator(value) {
                    return value === undefined || typeof value === 'object';
                }
            }
        },
        computed: {
            isApprovingDisabled() {
                return _.isEmpty(this.tokensAmount) || !_.isNumber( parseInt(this.tokensAmount) );
            },
            ...mapGetters({
                user: 'auth/user'
            })
        },
        data() { 
            return {
                tokensAmount: undefined,
                coverLetter: '',

                isApprovingLoading: false,
                isDenyingLoading: false
            }
        },
        methods: {
            close() {
                this.$emit('onClose');
            },

            sendProposal() {
                const amount = parseInt(this.tokensAmount) * this.DEIP_1_PERCENT
                this.isApprovingLoading = true;
                createInviteProposal(
                    this.groupId,
                    this.joinRequest.username,
                    amount,
                    this.coverLetter
                ).then(() => {
                    this.$store.dispatch('researchGroup/loadJoinRequests', { groupId: this.groupId });
                    this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.groupId });
                    this.$store.dispatch('layout/setSuccess', { message: `Invite proposal for "${this.joinRequest.username}" has been created successfully !`});
                }, (err) => {
                    this.$store.dispatch('layout/setError', { message: "An error occurred while approving join request, please try again later" });
                    console.log(err)
                })
                .finally(() => {
                    this.isApprovingLoading = false;
                    this.close();
                })
            },

            denyJoinRequest() {
                const self = this;
                const update = Object.assign({}, self.joinRequest, { status: 'denied' });
                self.isDenyingLoading = true;

                joinRequestsService.updateJoinRequest({request: update})
                    .then((updatedRequest) => {
                            self.$store.dispatch('researchGroup/loadJoinRequests', {groupId: self.groupId});
                            self.$store.dispatch('layout/setSuccess', { message: `You have denied join request from  "${self.joinRequest.username}" successfully !`});

                            setTimeout(() => self.close(), 500);
                        },
                        (err) => {
                            self.$store.dispatch('layout/setError', { message: "An error occurred while denying join request, please try again later" });
                            console.log(err)
                        }
                    )
                    .finally(() => {
                        self.isDenyingLoading = false;
                    })
            }
        },
        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.tokensAmount = undefined;
                    this.coverLetter = this.joinRequest.coverLetter;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
