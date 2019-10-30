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

                <div class="c-pt-4" v-if="locationString !== ''">
                    <div class="row half-bold">
                        <span class="c-mt-1">
                            <v-icon small>location_on</v-icon> {{ locationString }}
                        </span>
                    </div>
                </div>

                <div v-if="claimerInfo.profile" class="c-pt-2">{{ claimerInfo | employmentOrEducation}}</div>
            </div>
        </div>

        <div class="bold title c-pt-8">Discipline: {{ claim.discipline.name }}</div>
        <div class="bold title c-pt-8">Cover letter</div>
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
            <div class="row legacy-align-items-center legacy-justify-center" v-if="claim.username !== user.username && !isClaimAccepted">
                <v-btn color="primary" class="ma-0 width-9" large
                    :disabled="isApproveBtnDisabled"
                    :loading="isApproveBtnLoading"
                    @click="approveProposal(proposal)"
                >{{ isApproveBtnVoted ? 'Approved' : 'Approve' }}</v-btn>

                <div class="grey--text c-pl-6">
                    voted 
                    {{ (proposal.total_voted_expertise / (proposal.discipline.total_expertise_amount || 1) * 100).toFixed(2) }}
                    %
                </div>
            </div>

            <div class="row legacy-align-items-center legacy-justify-center" v-if="isClaimAccepted">
                <span class="headline green--text text--darken-1 c-pr-3">Claimed</span>
                <v-icon size="35" color="green darken-1">mdi-check</v-icon>
            </div>
        </div>

        <!-- <claim-user-expertise-details-allocation-dialog
            :is-shown="isAllocationDialogShown"
            :claimer="claimerInfo"
            :discipline-id="claim.disciplineId"
            @close="isAllocationDialogShown = false"
            @onCreate="reloadProposals()"
        ></claim-user-expertise-details-allocation-dialog> -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { voteForExpertiseClaim } from './../../../../services/ExpertiseClaimsService';

    export default {
        name: 'ClaimUserExpertiseDetailsBody',

        data() {
            return {
                isAllocationDialogShown: false,
                isApproveBtnLoading: false,
                wasApproved: false
            }
        },

        computed: {
            ...mapGetters({
                claimerInfo: 'claimExpertiseDetails/claimerInfo',
                claim: 'claimExpertiseDetails/claim',
                proposal: 'claimExpertiseDetails/proposal',
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
            },

            isApproveBtnDisabled() {
                if (this.proposal.claimer === this.user.username) {
                    return true;
                }

                const hasExpertise = !!_.find(this.user.expertTokens, { discipline_id: this.proposal.discipline_id });
                const wasVoted = this.isApproveBtnVoted;

                return !hasExpertise || wasVoted || this.isApproveBtnLoading;
            },

            isApproveBtnVoted() {
                const isVoted = !!_.find(this.proposal.votes, vote => vote.voter === this.user.username);
                return isVoted || this.wasApproved;
            },

            isClaimAccepted() {
                return _.some(this.claimerInfo.expertise, item => item.discipline_id === this.claim.disciplineId);
            }
        },

        methods: {
            approveProposal(proposal) {
                this.isApproveBtnLoading = true;
                voteForExpertiseClaim(proposal.id, this.user.username, this.DEIP_100_PERCENT)
                    .then(() => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "You have voted for the claim successfully"
                        });

                        this.wasApproved = true;
                        this.reloadProposal();
                    }).catch(e => {
                        this.$store.dispatch('layout/setError', {
                            message: "Error occured"
                        });

                        console.log(e);
                    }).finally(() => {
                        this.isApproveBtnLoading = false;
                    });
            },
            
            reloadProposal() {
                this.$store.dispatch('claimExpertiseDetails/loadClaimProposal', {
                    username: this.claim.username,
                    disciplineId: this.claim.disciplineId
                });

                this.$store.dispatch('claimExpertiseDetails/loadClaimerExpertise', { username: this.claim.username });
            }
        },
        
        created() {
        }
    }
</script>

<style lang="less" scoped>
</style>
