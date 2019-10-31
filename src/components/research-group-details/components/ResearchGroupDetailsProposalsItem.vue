<template>
    <v-expansion-panel-content>
        <div slot="header">
            <div class="legacy-row-nowrap align-center" v-on:click.stop>
                <div class="id-col">
                    <div class="deip-blue-color half-bold">{{ proposal.id }}</div>
                </div>

                <div class="proposal-activity">

                    <!-- proposal title depending on type -->
                    <div class="display-flex" 
                        v-if="proposal.action === proposalTypes.START_RESEARCH"
                    >
                        <v-icon small color="primary" class="c-mr-2">add</v-icon>
                        <div class="a">{{ proposal.data.title }}</div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.INVITE_MEMBER"
                    >
                        <v-icon small color="primary" class="c-mr-2">person_add</v-icon>
                        <div class="a">{{ proposal.data.name }}</div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.SEND_FUNDS"
                    >
                        <v-icon small color="primary" class="c-mr-2">money_off</v-icon>
                        <div class="a">Transfer tokens</div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.START_RESEARCH_TOKEN_SALE"
                    >
                        <v-icon small color="primary" class="c-mr-2">attach_money</v-icon>
                        <div class="a">
                            {{ convertToPercent(proposal.data.amount_for_sale) }}% fundraise
                        </div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.CHANGE_QUORUM"
                    >
                        <v-icon small color="primary" class="c-mr-2">mdi-percent</v-icon>
                        <div class="a">
                            Change of quorum
                        </div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.CREATE_RESEARCH_MATERIAL"
                    >
                        <v-icon small color="primary" class="c-mr-2">note_add</v-icon>
                        <router-link class="a" :to="{
                                name: 'ResearchDetails', 
                                params: {
                                    research_group_permlink: encodeURIComponent(proposal.extension.research.group_permlink),
                                    research_permlink: encodeURIComponent(proposal.extension.research.permlink)
                                }
                            }"
                        >{{ proposal.extension.research.title }}</router-link>
                    </div>
                    <!-- proposal title depending on type -->

                </div>

                <div class="date">
                    <div class="caption">{{ proposal.creation_time | dateFormat("D MMM YYYY", true) }}</div>
                </div>

                <div class="date">
                    <div class="caption">{{ proposal.expiration_time | dateFormat("D MMM YYYY", true) }}</div>
                </div>

                <div class="created-by">
                    <router-link :to="'/user-details/' + proposal.creator" class="a overflow-ellipsis">{{ proposal.creator }}</router-link>
                </div>

                <div class="voted">
                    <v-tooltip right>
                        <div slot="activator">
                            {{ approvedPercent }} of {{ convertToPercent(proposal.quorum_percent) }}%
                        </div>

                        <span>
                            Approved by<br> 
                            <b>{{ proposal.voted_accounts.join(', ') }}</b>
                        </span>
                    </v-tooltip>
                </div>

                <div class="action-col">
                    <v-btn flat small 
                        v-if="!proposal.is_completed"
                        color="primary" 
                        class="ma-0"
                        :disabled="isApprovingLoading || isApproved"
                        :loading="isApprovingLoading"
                        @click="approve()"
                    >
                        {{ !isApproved ? 'Approve' : 'Approved' }}
                    </v-btn>
                </div>
            </div>
        </div>
        
        <v-card>
            <v-card-text class="pt-0">
                <div class="description caption">

                    <!-- proposal description depending on type -->
                    <div class="display-flex" 
                        v-if="proposal.action === proposalTypes.START_RESEARCH"
                    >
                        <div class="legacy-col-6">
                            <div class="grey--text">{{ proposal.creator }}</div>
                            <div class="c-pt-2">
                                Reviewers' reward:
                                <span class="bold">{{ convertToPercent(proposal.data.review_share_in_percent) }}%</span>
                            </div>
                        </div>
                        <div class="legacy-col-6 grey--text legacy-column flex-wrap" style="max-height: 70px">
                            <div v-for="(label, i) in getDisciplineNames()" :key="i">{{ label }}</div>
                        </div>
                    </div>

                    <div class="legacy-row" v-else-if="proposal.action === proposalTypes.INVITE_MEMBER">
                        <div class="legacy-col-6">
                            Research group tokens:
                            <span class="bold">
                                {{ convertToPercent(proposal.data.research_group_token_amount_in_percent) }}%
                            </span>
                        </div>
                        <div class="legacy-col-6 grey--text break-word white-space-pre-line">{{ proposal.data.cover_letter }}</div>
                    </div>

                    <div class="legacy-row" v-else-if="proposal.action === proposalTypes.SEND_FUNDS">
                        <div class="legacy-col-6">
                            <div>
                                User:
                                <router-link :to="{
                                        name: 'UserDetails', 
                                        params: { account_name: proposal.data.recipient }
                                    }" 
                                    class="a"
                                >{{ proposal.extension.recipient | fullname }}</router-link>
                            </div>
                            <div>
                                Amount:
                                <span class="bold">
                                    {{ proposal.data.funds }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="legacy-row" v-else-if="proposal.action === proposalTypes.START_RESEARCH_TOKEN_SALE">
                        <div class="legacy-col-6 legacy-row legacy-justify-between">
                            <div class="width-8">
                                <div>
                                    Min: <span class="bold right">{{ fromAssetsToFloat(proposal.data.soft_cap) }}</span>
                                </div>
                                <div>
                                    Max: <span class="bold right">{{ fromAssetsToFloat(proposal.data.hard_cap) }}</span>
                                </div>
                            </div>
                            <div class="width-11 c-mr-10">
                                <div>
                                    Start Date:
                                    <span class="bold right">{{ proposal.data.start_time | dateFormat("HH:mm DD MMM YYYY", true) }}</span>
                                </div>
                                <div>
                                    End Date: 
                                    <span class="bold right">{{ proposal.data.end_time | dateFormat("HH:mm DD MMM YYYY", true) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="legacy-row" v-else-if="proposal.action === proposalTypes.CHANGE_QUORUM">
                        <div class="legacy-col-6">
                            <div>
                                Type:
                                <span class="bold">{{ proposalLabels[proposal.data.proposal_type] }}</span>
                            </div>
                            <div>
                                Proposed percent:
                                <span class="bold">
                                    {{ convertToPercent(proposal.data.quorum_percent) }}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="legacy-row" v-else-if="proposal.action === proposalTypes.CREATE_RESEARCH_MATERIAL">
                        <div class="legacy-col-6">
                            <div class="grey--text">{{ proposal.data.authors.join(' · ') }}</div>
                            <span class="bold">{{ getContentTypeStrById(proposal.data.type) }}:</span>
                            <a :href="getContentUrl(proposal)" class="a" target="_blank">{{ proposal.data.title }}</a>
                        </div>
                        <div class="legacy-col-6"></div>
                    </div>
                    <!-- proposal description depending on type -->
                        
                </div>
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { voteForProposal, types, labels } from "./../../../services/ProposalService";
    import * as researchService from "./../../../services/ResearchService";
    import * as disciplineTreeService from "./../../common/disciplines/DisciplineTreeService";
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ResearchGroupDetailsProposalsItem",

        props: {
            proposal: { type: Object, required: true }
        },

        data() { 
            return {
                proposalTypes: _.cloneDeep(types),
                proposalLabels: _.cloneDeep(labels),
                isApprovingLoading: false
            } 
        },

        methods: {
            ...mapActions({
                changeProposal: 'researchGroup/changeProposal'
            }),
            approve() {
                this.isApprovingLoading = true;
                voteForProposal(this.group.id, this.proposal.id)
                    .then(() => {
                        this.isApprovingLoading = false;
                        let copy = _.cloneDeep(this.proposal);
                        copy.voted_accounts.push(this.currentUser.username);
                        this.changeProposal({ old: this.proposal, new: copy });
                    }).catch(err => {
                        alert(err.message);
                    });
            },

            // for START_RESEARCH
            getDisciplineNames() {
                let nodes = disciplineTreeService.getNodesByIdList(this.proposal.data.disciplines);
                return nodes.map(node => node.label)
            },

            // for CREATE_RESEARCH_MATERIAL
            getContentTypeStrById(id) {
                let contentType = _.find(researchService.contentTypesList, item => item.id === id);
                return contentType.text;
            },
            getContentUrl(proposal) {
                return `/#/${encodeURIComponent(proposal.extension.research.group_permlink)}/research/${encodeURIComponent(proposal.extension.research.permlink)}/!draft?ref=${proposal.extension.draftContent._id}`;
            }
        },

        computed: {
            ...mapGetters({
                group: 'researchGroup/group',
                groupShares: 'researchGroup/groupShares',
                currentUser: 'auth/user'
            }),
            isApproved() {
                return _.includes(this.proposal.voted_accounts, this.currentUser.username);
            },
            approvedPercent() {
                return this.convertToPercent(
                    this.proposal.voted_accounts.reduce((acc, accountName) => {
                        let shares = _.find(this.groupShares, { 'owner': accountName });
                        return shares ? acc + shares.amount : acc;
                    }, 0)
                );
            }
        }
    };
</script>

<style lang="less" scoped>
    .description {
        padding-left: 68px;
        padding-right: 8px;
    }
</style>
