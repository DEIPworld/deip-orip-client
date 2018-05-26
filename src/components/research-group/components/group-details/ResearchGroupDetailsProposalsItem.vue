<template>
    <v-expansion-panel-content>
        <div slot="header">
            <div class="row-nowrap align-center" v-on:click.stop>
                <div class="id-col">
                    <div class="a">{{ proposal.id }}</div>
                </div>
                <div class="proposal-type">

                    <div class="display-flex" 
                        v-if="proposal.action === proposalTypes.startResearchTokenSale"
                    >
                        <v-icon small color="primary" class="c-mr-2">attach_money</v-icon>
                        <div class="a">
                            Sale: {{ proposal.data.amount_for_sale }}
                            (SC {{ proposal.data.soft_cap }} - HC {{ proposal.data.hard_cap }})
                        </div>
                    </div>

                    <div class="display-flex" 
                        v-else-if="proposal.action === proposalTypes.createResearchMaterial"
                    >
                        <v-icon small color="primary" class="c-mr-2">note_add</v-icon>
                        <div class="a">{{ proposal.data.title }}</div>
                    </div>

                </div>
                <div class="date">
                    <div class="caption">{{ proposal.creation_time | dateFormat("D MMM, YYYY") }}</div>
                </div>
                <div class="date">
                    <div class="caption">{{ proposal.expiration_time | dateFormat("D MMM, YYYY") }}</div>
                </div>
                <div class="created-by">
                    <router-link to="/userDetails" class="a overflow-ellipsis">{{ proposal.creator }}</router-link>
                </div>
                <div class="voted">
                    <div>
                        {{ (proposal.voted_accounts.length / groupShares.length * 100).toFixed() }}
                        of
                        {{ convertToPercent(proposal.quorum_percent) }}%
                    </div>
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
                <div class="c-ph-2">
                    <div class="caption">
                        Seamlessly leverage existing empowered relationships whereas high-payoff potentialities. 
                        Dynamically maximize accurate networks whereas revolutionary innovation. Compellingly 
                        repurpose 24/365 deliverables rather than holistic intellectual capital. Authoritatively 
                        evolve prospective paradigms without vertical services. Compellingly.
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import * as proposalService from "./../../services/ProposalService";
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc';

    export default {
        name: "ResearchGroupDetailsProposalsItem",
        props: {
            proposal: { type: Object, required: true }
        },
        data() { 
            return {
                proposalTypes: proposalService.types,
                isApprovingLoading: false
            } 
        },
        methods: {
            ...mapActions({
                changeProposal: 'researchGroup/changeProposal'
            }),
            approve() {
                this.isApprovingLoading = true;

                deipRpc.broadcast.voteProposalAsync(
                    this.currentUser.privKey,
                    this.currentUser.username, 
                    this.proposal.id, 
                    this.group.id
                ).then(() => {
                    this.isApprovingLoading = false;

                    let copy = _.cloneDeep(this.proposal);
                    copy.voted_accounts.push(this.currentUser.username);
                    this.changeProposal({ old: this.proposal, new: copy });
                }).catch(err => {
                    alert(err.message);
                });
            }
        },
        computed: {
            ...mapGetters({
                group: 'researchGroup/group',
                groupShares: 'researchGroup/groupShares',
                currentUser: 'user'
            }),
            isApproved() {
                return _.includes(this.proposal.voted_accounts, this.currentUser.username);
            }
        }
    };
</script>

<style lang="less">
</style>
