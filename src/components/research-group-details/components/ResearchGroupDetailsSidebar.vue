<template>
    <div>
        <!-- ### START Research Group Details Section ### -->
        <div>
            <div class="sm-title bold">Group info</div>
            <div class="c-pt-4 c-pb-2">
                <div v-for="(item, i) in groupExpertise" :key="i">
                    <span class="half-bold">{{ item.disciplineName }}</span>
                    <span class="right">{{ item.value }}</span>
                </div>
            </div>
        </div>

        <!-- ### END Research Group Details Section ### -->

    <!-- <sidebar-splitted-btn :right-ripple="false">
            <div slot="left" class="default-half-splitted">
                <span class="c-m-auto clickable-label">23<br>Followers</span>
            </div>
        </sidebar-splitted-btn> -->

        <div v-if="!group.is_personal" class="c-mt-6">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="sm-title bold c-mt-4">Quorum setup</div>

            <div class="c-pt-4 c-pb-4">
                <!-- no v-for bc order and padding are important -->
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[0][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[0][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[9][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[9][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[7][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[7][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between c-pt-2">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[1][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[1][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[2][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[2][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between c-pt-2">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[4][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[4][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[8][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[8][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[3][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[3][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between c-pt-2">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[6][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[6][1] ) }}%</div>
                </div>
                <div class="row-nowrap justify-between">
                    <div class="half-bold">{{ proposalLabels[ group.proposal_quorums[5][0] ] }}</div>
                    <div class="">{{ convertToPercent( group.proposal_quorums[5][1] ) }}%</div>
                </div>
            </div>
        </div>

        <!-- ### START Research Group Join Requests Section ### -->
        <div v-if="isJoinRequestsSectionAvailable" class="c-mt-6">
            <div>
                <div class="sidebar-fullwidth"><v-divider></v-divider></div>
                <div class="sm-title bold c-mt-4">Join requests: {{pendingJoinRequests.length}}</div>

                <div class="c-pb-6">
                    <div v-for="(join, index) in pendingJoinRequests" class="row-nowrap justify-between align-center c-pt-4">
                        <div>
                            <v-avatar size="40px">
                                <img v-if="join.user.profile" v-bind:src="join.user.profile.avatar | avatarSrc(40, 40, false)" />
                                <v-gravatar v-else :title="join.user.account.name" :email="join.user.account.name + '@deip.world'" />
                            </v-avatar>
                            <span class="a c-pl-3">{{join.user | fullname}}</span>
                        </div>
                        
                        <v-btn @click="openJoinRequestDetails(join)" flat icon color="grey" class="ma-0">
                            <v-icon>mail_outline</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Group Join Requests Section ### -->

        <handle-join-request-dialog v-if="group"
            :is-open="options.isHandleRequestDialogOpen"
            :join-request="selectedJoinRequest"
            :group-id="group.id"
            @onClose="closeHandleJoinRequestDialog"
        ></handle-join-request-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _ from 'lodash';
    import joinRequestsService from './../../../services/http/joinRequests'
    import * as proposalService from './../../../services/ProposalService';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ResearchGroupDetailsSidebar",
        data() {
            return {
                isApprovingJoinRequest: false,
                isDenyingJoinRequest: false,

                selectedJoinRequest: undefined,
                isHandleRequestDialogOpen: true,

                proposalLabels: _.cloneDeep(proposalService.labels)
            };
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userPersonalGroup: 'auth/userPersonalGroup',
                group: 'researchGroup/group',
                members: 'researchGroup/members',
                options: 'researchGroup/options',
                pendingJoinRequests: 'researchGroup/pendingJoinRequests'
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

            isJoinRequestsSectionAvailable() {
                let hasPendingJoinRequests = this.pendingJoinRequests && this.pendingJoinRequests.length;

                let isResearchGroupMember = this.group != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id) 
                    : false

                return hasPendingJoinRequests && isResearchGroupMember;
            }
        },

        methods: {
            openJoinRequestDetails(item) {
                this.$store.dispatch('researchGroup/changeOptions', { key: 'isHandleRequestDialogOpen', value: true });
                this.selectedJoinRequest = item;
            },
            closeHandleJoinRequestDialog() {
                this.$store.dispatch('researchGroup/changeOptions', { key: 'isHandleRequestDialogOpen', value: false });
                this.selectedJoinRequest = undefined;
            },
        }
    };
</script>

<style lang="less" scoped>
    .join-request-title-info {
        padding-left: 10px;
        padding-top: 3px;
    }
</style>
