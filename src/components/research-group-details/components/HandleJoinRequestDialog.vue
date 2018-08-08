<template>
    <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="700px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Handle join request</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <div class="column-page">
                <div class="content-column">
                    <div class="filling">
                        <div class="c-pb-4" v-if="joinRequest">
                            <v-avatar size="40px">
                                <img v-if="joinRequest.user.profile" v-bind:src="joinRequest.user.profile.avatar | avatarSrc(40, 40, false)" />
                                <v-gravatar v-else :title="joinRequest.user.account.name" :email="joinRequest.user.account.name + '@deip.world'" />
                            </v-avatar>

                            <span class="half-bold c-pl-3">{{ joinRequest.user | fullname }}</span>
                        </div>

                        <v-text-field
                            label="Group tokens share"
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
                            <div class="c-m-auto">
                                <v-btn color="primary"
                                    :disabled="isApprovingDisabled || isApprovingLoading"
                                    :loading="isApprovingLoading"
                                    @click="sendProposal()"
                                >Approver and create proposal</v-btn>

                                <v-btn color="error" flat
                                    @click="denyJoinRequest()"
                                    :loading="isDenyingLoading"
                                    :disabled="isDenyingLoading"
                                >Deny</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import * as proposalService from './../../../services/ProposalService';
    import joinRequestsService from './../../../services/joinRequests'
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
                const self = this;
                const update = Object.assign({}, self.joinRequest, { status: 'Approved' });
                const amount = parseInt(this.tokensAmount) * this.DEIP_1_PERCENT
                this.isApprovingLoading = true;

                deipRpc.api.getDynamicGlobalProperties(function(err, result) {
                    if (!err) {
                        const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
                        deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function(e, res) {
                            const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
                            const now = new Date().getTime() + 3e6;
                            const expire = new Date(now).toISOString().split('.')[0];

                            let proposal = proposalService.getStringifiedProposalData(
                                proposalService.types.INVITE_MEMBER, [
                                self.groupId,
                                self.joinRequest.username,
                                amount
                            ]);

                            const operation = ["create_proposal", {
                                creator: self.user.username,
                                research_group_id: self.groupId,
                                data: proposal,
                                action: proposalService.types.INVITE_MEMBER,
                                expiration_time: new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
                            }];

                            const unsignedTX = {
                                'expiration': expire,
                                'extensions': [],
                                'operations': [operation],
                                'ref_block_num': BlockNum,
                                'ref_block_prefix': BlockPrefix
                            };

                            try {
                                const signedTX = deipRpc.auth.signTransaction(unsignedTX, {
                                    "owner":  self.user.privKey
                                })

                                joinRequestsService.updateJoinRequest({request: update, tx: signedTX})
                                    .then((updatedRequest) => {
                                            self.$store.dispatch('researchGroup/loadJoinRequests', { groupId: self.groupId });
                                            self.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: self.groupId });
                                            self.$store.dispatch('layout/setSuccess', { message: `Invite proposal for "${self.joinRequest.username}" has been created successfully !`});

                                            setTimeout(() => self.close(), 500);
                                        },
                                        (err) => {
                                            self.$store.dispatch('layout/setError', { message: "An error occurred while approving join request, please try again later" });
                                            console.log(err)
                                        }
                                    )
                                    .finally(() => {
                                        self.isApprovingLoading = false;
                                    })

                            } catch (err) {
                                self.isApprovingLoading = false;
                                self.$store.dispatch('layout/setError', { message: "An error occurred while approving join request, please try again later"});
                                console.log(err);
                            }
                        });
                    }
                });
            },

            denyJoinRequest() {
                const self = this;
                const update = Object.assign({}, self.joinRequest, { status: 'Denied' });
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
                    this.coverLetter = `${this.joinRequest.coverLetter}`;
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
