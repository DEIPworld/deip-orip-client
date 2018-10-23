<template>
    <div class="">
        <div class="row">
            <v-avatar size="160px" class="">
                <img v-if="claimerInfo.profile" v-bind:src="claimerInfo.profile.avatar | avatarSrc(160, 160, false)" />
                <v-gravatar v-if="!claimerInfo.profile && claimerInfo.account" :email="claimerInfo.account.name + '@deip.world'" />
            </v-avatar>

            <div class="col-grow c-pl-12">
                <div class="display-1 half-bold c-pt-4">
                    <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: claimerInfo.account.name }}">
                        {{ claimerInfo | fullname }}
                    </router-link>
                </div>

                <div class="c-pt-4">
                    <div class="row half-bold">
                        <span class="c-mt-1">
                            <v-icon small>location_on</v-icon> {{ locationString }}
                        </span>
                    </div>
                </div>

                <div v-if="claimerInfo.profile" class="c-pt-2">{{ claimerInfo | employmentOrEducation}}</div>
            </div>
        </div>

        <div class="bold title c-pt-8">Discipline: {{ claim.discipline.label }}</div>
        <div class="bold title c-pt-8">Motivation letter</div>

        <div class="c-pt-4">{{ claim.coverLetter }}</div>
        
        <div class="bold title c-pt-8">Publications</div>

        <v-card class="c-mt-6 hidden-last-child">
            <template v-for="publicationUrl in claim.publications">
                <div class="c-p-6">
                    <v-icon color="primary" class="c-mr-3">mdi-note-text</v-icon>
                    <a class="a" :href="publicationUrl" target="_blank">{{ publicationUrl }}</a>
                </div>

                <v-divider></v-divider>
            </template>
        </v-card>

        <div class="c-mt-8">
            <v-btn color="primary" class="ma-0" @click="isAllocationDialogShown = true">Create a proposal</v-btn>
        </div>
        
        <div class="" v-if="proposals.length">
            <div class="bold title c-pt-8">Proposals: {{ proposals.length }}</div>

            <v-card class="c-mt-6 hidden-last-child">
                <template v-for="proposal in proposals">
                    <div class="row-nowrap align-items-center">
                        <div class="row-nowrap col-grow c-pv-6 c-ph-8">
                            <v-avatar size="40px" class="">
                                <img v-if="proposal.initiatorInfo.profile" v-bind:src="proposal.initiatorInfo.profile.avatar | avatarSrc(40, 40, false)" />
                                <v-gravatar v-if="!proposal.initiatorInfo.profile && proposal.initiatorInfo.account" :email="proposal.initiatorInfo.account.name + '@deip.world'" />
                            </v-avatar>

                            <div class="c-pl-4">
                                <router-link :to="{
                                        name: 'UserDetails', 
                                        params: { account_name: proposal.initiatorInfo.account.name }
                                    }"
                                    class="a subheading"
                                >{{ proposal.initiatorInfo | fullname }}</router-link>

                                <div class="caption c-pt-1">{{ proposal.initiatorInfo | employmentOrEducation }}</div>
                            </div>
                        </div>

                        <div class="proposal-cell-devider"></div>

                        <div class="c-pv-6 c-ph-8">
                            <div v-for="(proposal, i) in proposal.initiatorExpertise" :key="i">    
                                <span class="grey--text">{{ proposal.discipline_name }} {{ proposal.amount }}</span>
                            </div>
                        </div>

                        <div class="proposal-cell-devider"></div>

                        <div class="c-pv-6 c-ph-8 text-align-center">
                            <div class="title bold">{{ proposal.amount }}</div>
                            <div class="sm-title bold">expertise</div>
                        </div>

                        <div class="proposal-cell-devider"></div>

                        <div class="c-pv-6 c-ph-8">
                            voted: {{ (proposal.total_voted_expertise / proposal.discipline.total_expertise_amount).toFixed(2) }}%
                        </div>

                        <div class="proposal-cell-devider"></div>

                        <div class="align-self-stretch">
                            <v-btn class="ma-0 approve-proposal-btn"
                                flat color="primary"
                                :disabled="isApproveBtnDisabled(proposal)"
                                :loading="isApproveBtnLoading(proposal)"
                                @click="approveProposal(proposal)"
                            >Approve</v-btn>
                        </div>
                    </div>

                    <v-divider></v-divider>
                </template>
            </v-card>
        </div>

        <claim-user-expertise-allocation-dialog
            :is-shown="isAllocationDialogShown"
            :claimer="claimerInfo"
            :discipline-id="claim.disciplineId"
            @close="isAllocationDialogShown = false"
        ></claim-user-expertise-allocation-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: 'ClaimUserExpertiseBody',
        data() {
            return {
                isAllocationDialogShown: false,
                loadingProposalIds: []
            }
        },
        computed: {
            ...mapGetters({
                claimerInfo: 'claimExpertise/claimerInfo',
                claim: 'claimExpertise/claim',
                proposals: 'claimExpertise/proposals',
                user: 'auth/user',
            }),
            locationString() {
                const profile = this.claimerInfo ? this.claimerInfo.profile : null;
                let location = "";

                if (profile) {
                    location += profile.location.city ? profile.location.city : '';
                    location += profile.location.city && profile.location.country ? ', ' : '';
                    location += profile.location.country ? profile.location.country : '';
                }

                return location;
            }
        },
        methods: {
            isApproveBtnDisabled(proposal) {
                if (proposal.claimer === this.user.username) {
                    return true;
                }

                const hasExpertise = _.find(this.user.expertTokens, { discipline_id: proposal.discipline_id });

                if (!hasExpertise) {
                    return true;
                }

                if (this.loadingProposalIds.includes(proposal.id)) {
                    return true;
                }

                return false;
            },
            isApproveBtnLoading(proposal) {
                return this.loadingProposalIds.includes(proposal.id);
            },
            approveProposal(proposal) {
                this.loadingProposalIds.push(proposal.id);                

                deipRpc.broadcast.voteForExpertiseAllocationProposalAsync(
                    this.user.privKey,
                    proposal.initiator,
                    proposal.claimer,
                    proposal.discipline_id,
                    this.user.username,
                    this.DEIP_100_PERCENT
                ).then(() => {
                    this.$store.dispatch('layout/setSuccess', {
                        message: "Proposal was successfully created"
                    });
                }).catch(e => {
                    this.$store.dispatch('layout/setError', {
                        message: "Error occured"
                    });

                    console.log(e);
                }).finally(() => {
                    const idIndex = _.findIndex(this.loadingProposalIds, id => id === proposal.id);

                    if (idIndex > -1) {
                        this.loadingProposalIds.splice(idIndex, 1);
                    }
                })


                // setTimeout(() => {
                //     const idIndex = _.findIndex(this.loadingProposalIds, id => id === proposal.id);

                //     if (idIndex > -1) {
                //         this.loadingProposalIds.splice(idIndex, 1);
                //     }

                //     this.$store.dispatch('layout/setSuccess', {
                //         message: "Proposal was successfully created"
                //     });
                // }, 2000);
            }
        },
        created() {
        }
    }
</script>

<style lang="less" scoped>
    .proposal-cell-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        align-self: stretch;
        margin: 12px 0;
    }

    .approve-proposal-btn {
        min-height: 100%;
        height: 0px;
        min-width: 110px;
    }
</style>
