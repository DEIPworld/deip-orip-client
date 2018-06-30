<template>
    <div class="research-group-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchGroupPage"></sidebar-loader>
      <div v-if="isLoadingResearchGroupPage === false">

        <!-- ### START Research Group Details Section ### -->
        <div class="research-group-info-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchGroupDetails" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupDetails === false">
                <div class="sm-title bold">Group Info</div>
                <div class="c-pt-4 c-pb-6">
                    <div v-for="(item, i) in groupExpertise" :key="i">
                        <span class="half-bold">{{ item.disciplineName }}</span>
                        <span class="right">{{ item.value }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Group Details Section ### -->
        
        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Group Followers Section ### -->
        <div style="margin: 0 -24px">
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">15<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <!-- <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">Follow</div>
                </div> -->
            </div>
        </div>
        <!-- ### END Research Group Followers Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START Research Group Join Requests Section ### -->
        <div v-if="isJoinRequestsSectionAvailable || isLoadingResearchGroupJoinRequests !== false" class="research-group-join-requests-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchGroupJoinRequests" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchGroupJoinRequests === false">
                <div class="sm-title bold c-pt-6">Join requests: {{pendingJoinRequests.length}}</div>
                <div class="c-pb-6">
                    <div v-for="(join, index) in pendingJoinRequests" class="row-nowrap justify-between align-center c-pt-4">
                        <div>
                            <v-avatar size="40px">
                                <img v-if="join.user.profile" v-bind:src="join.user.profile.avatar | avatarSrc(40, 40, false)" />
                                <v-gravatar v-else :title="join.user.account.name" :email="join.user.account.name + '@deip.world'" />
                            </v-avatar>
                            <span class="a c-pl-3">{{join.user | fullname}}</span>
                        </div>
                        <v-btn @click="openJoinRequestDetails(join, index)" flat icon color="grey" class="ma-0">
                            <v-icon>mail_outline</v-icon>
                        </v-btn>
                    </div>
                </div>

                <v-dialog v-model="selectedJoinRequestMeta.isShown" persistent max-width="800">
                    <v-card v-if="selectedJoinRequestMeta.item">
                        <v-card-title>
                            <span class="headline">{{selectedJoinRequestMeta.item.username}}</span>
                            <span class="join-request-title-info"></span>
                        </v-card-title>
                        <v-card-text class="text-align-center">{{selectedJoinRequestMeta.item.coverLetter}}</v-card-text>
                        <v-card-actions class="text-align-center mt-5">
                            <v-spacer></v-spacer>
                            <v-btn color="green lighten-1" flat 
                                :disabled="isApprovingJoinRequest" :loading="isApprovingJoinRequest" 
                                @click.native="approveJoinRequest(selectedJoinRequestMeta)">
                                Approve
                            </v-btn>
                            <v-btn color="red lighten-1" flat :disabled="isDenyingJoinRequest" :loading="isDenyingJoinRequest" 
                                @click.native="denyJoinRequest(selectedJoinRequestMeta)">
                                Deny
                            </v-btn>
                            <v-btn flat @click.native="closeJoinRequestDetails()">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
        <!-- ### END Research Group Join Requests Section ### -->

        <div v-if="isJoinRequestsSectionAvailable" class="section-divider">
            <v-divider></v-divider>
        </div>
      </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _ from 'lodash';
    import joinRequestsService from './../../../services/joinRequests'
    import * as proposalService from './../../../services/ProposalService';
    import deipRpc from '@deip/deip-rpc';

    export default {
        name: "ResearchGroupDetailsSidebar",
        data() {
            return {
                selectedJoinRequestMeta: { isShown: false, item: null, index: null },
                isApprovingJoinRequest: false,
                isDenyingJoinRequest: false
            };
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                group: 'researchGroup/group',
                members: 'researchGroup/members',
                isLoadingResearchGroupPage: 'researchGroup/isLoadingResearchGroupPage',
                pendingJoinRequests: 'researchGroup/pendingJoinRequests',
                isLoadingResearchGroupDetails: 'researchGroup/isLoadingResearchGroupDetails',
                isLoadingResearchGroupJoinRequests: 'researchGroup/isLoadingResearchGroupJoinRequests'
            }),
            groupExpertise() {
                return _.chain(this.members)
                    .map('expertise')
                    .flatten()
                    .groupBy('discipline_id')
                    .mapValues(item => {
                        return { 
                            value: item.reduce((acc, val) => acc + val.amount, 0),
                            disciplineName: item[0].discipline_name
                        }
                    })
                    .values()
                    .value();
            },
            isResearchGroupMember() {
                return this.group != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id) 
                    : false
            },
            hasPendingJoinRequests() {
                return this.pendingJoinRequests && this.pendingJoinRequests.length;
            },

            isJoinRequestsSectionAvailable() {
                return this.hasPendingJoinRequests && this.isResearchGroupMember
            }
        },

        methods: {
            openJoinRequestDetails(item, index) {
                this.selectedJoinRequestMeta.isShown = true;
                this.selectedJoinRequestMeta.item = item;
                this.selectedJoinRequestMeta.index = index;
            },
            closeJoinRequestDetails() {
                this.selectedJoinRequestMeta.isShown = false;
                this.selectedJoinRequestMeta.item = null;
                this.selectedJoinRequestMeta.index = null;
            },
            approveJoinRequest({item, index}) {
                const self = this;
                const update = Object.assign({}, item, { status: 'Approved' });
                self.isApprovingJoinRequest = true;

                deipRpc.api.getDynamicGlobalProperties(function(err, result) {
                    if (!err) {
                        const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
                        deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function(e, res) {
                            const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
                            const now = new Date().getTime() + 3e6;
                            const expire = new Date(now).toISOString().split('.')[0];

                            let proposal = proposalService.getStringifiedProposalData(
                                proposalService.types.inviteMember, [
                                self.group.id,
                                item.username,
                                5 * self.DEIP_1_PERCENT
                            ]);

                            const operation = ["create_proposal", {
                                    creator: self.user.username,
                                    research_group_id: self.group.id,
                                    data: proposal,
                                    action: proposalService.types.inviteMember,
                                    expiration_time: new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
                            }]

                            const unsignedTX = {
                                'expiration': expire,
                                'extensions': [],
                                'operations': [operation],
                                'ref_block_num': BlockNum,
                                'ref_block_prefix': BlockPrefix
                            }
                            try {
                                const signedTX = deipRpc.auth.signTransaction(unsignedTX, {
                                    "owner":  self.user.privKey
                                })

                                joinRequestsService.updateJoinRequest({request: update, tx: signedTX})
                                    .then((updatedRequest) => {
                                            self.$store.dispatch('researchGroup/loadJoinRequests', { groupId: self.group.id });
                                            self.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: self.group.id });
                                            self.$store.dispatch('layout/setSuccess', { message: `Invite proposal for "${item.username}" has been created successfully !`});
                                        },
                                        (err) => {
                                            self.$store.dispatch('layout/setError', { message: "An error occurred while approving join request, please try again later" });
                                            console.log(err)
                                        }
                                    )
                                    .finally(() => {
                                        self.selectedJoinRequestMeta.isShown = false;
                                        self.selectedJoinRequestMeta.item = null;
                                        self.selectedJoinRequestMeta.index = null;
                                        self.isApprovingJoinRequest = false;
                                    })

                            } catch (err) {
                                self.selectedJoinRequestMeta.isShown = false;
                                self.selectedJoinRequestMeta.item = null;
                                self.selectedJoinRequestMeta.index = null;
                                self.isApprovingJoinRequest = false;
                                self.$store.dispatch('layout/setError', { message: "An error occurred while approving join request, please try again later"});
                                console.log(err);
                            }
                        });
                    }
                });
            },

            denyJoinRequest({item, index}) {
                const self = this;
                const update = Object.assign({}, item, { status: 'Denied' });
                self.isDenyingJoinRequest = true;

                joinRequestsService.updateJoinRequest({request: update})
                    .then((updatedRequest) => {
                        self.$store.dispatch('researchGroup/loadJoinRequests', {groupId: self.group.id});
                        self.$store.dispatch('layout/setSuccess', { message: `You have denied join request from  "${item.username}" successfully !`});
                    },
                    (err) => {
                        self.$store.dispatch('layout/setError', { message: "An error occurred while denying join request, please try again later" });
                        console.log(err)
                    })
                    .finally(() => {
                        self.selectedJoinRequestMeta.isShown = false;
                        self.selectedJoinRequestMeta.item = null;
                        self.selectedJoinRequestMeta.index = null;
                        self.isDenyingJoinRequest = false;
                    })
            }
        }
    };
</script>

<style lang="less" scoped>
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }

    .section-divider {
        margin: 0 -24px;
    }

    .join-request-title-info {
        padding-left: 10px;
        padding-top: 3px;
    }

    .research-group-details-sidebar-container {
        
    }

    .research-group-info-container {
        min-height: 200px;
    }

    .research-group-join-requests-container {
        // min-height: 200px;
    }

</style>
