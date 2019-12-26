<template>
    <div>
        <div v-if="agency" class="text-align-center">         
            <div>
                <v-avatar size="120px">
                    <img :src="agency | tenantSymbolSrc(160, 160, false)" />
                </v-avatar>
            </div>
            <div class="c-pt-5 title">{{agency.name}}</div>
        </div>
  <!--  <div v-if="review.author.account.name !== user.username && userHasExpertise">
            <div class="support-review-button">
                <v-btn block color="primary"
                    :loading="isReviewVoting" 
                    :disabled="isReviewVoting || userHasVoted || votingDisabled"
                    @click="voteReview()">
                    Support Review
                </v-btn>
            </div>
        </div> -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService'; 
    import tenantHttp from './../../../services/http/tenant';

    export default {
        name: "ResearchApplicationReviewSidebar",

        data() {
            return {
                isReviewVoting: false,
                votingDisabled: false,
                agencies: []
            };
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                research: 'rad/research',
                program: 'rad/program',
                applicationReviewsList: 'rad/applicationReviewsList'
            }),
            agency() {
                return this.agencies.find(r => r._id == this.program.agency_name);
            },
            review() {
                return this.applicationReviewsList.find(r => r.id == this.$route.params.review_id)
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => 
                            this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
            userHasVoted() {
                return this.review != null ? 
                    this.review.votes.some(vote => vote.voter === this.user.username) 
                    : false;
            }
        },
        
        methods: {
            voteReview() {
                const self = this;
                const review = this.review;
                this.isReviewVoting = true;
                // vote for all disciplines for now
                // todo: add a control to select specific discipline
                const disciplinesIds = this.userExperise
                    .map(exp => exp.discipline_id)
                    .filter(id => review.disciplines.find(d => d.id === id));
            
                // I have no idea why, but "deipRpc.broadcast.voteForReviewAsync" doesn't work here, 
                // the promise just never gets resolved or rejected although operation is sent and applied in the blockchain.
                // Possibly there is a bug in 'deipRpc', needs to be reviewed later.
                deipRpc.api.getDynamicGlobalProperties(function(err, result) {
                    if (!err) {
                        const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
                        deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function(e, res) {
                            const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
                            const now = new Date().getTime() + 3e6;
                            const expire = new Date(now).toISOString().split('.')[0];
                    
                            const operations = disciplinesIds.map(disciplinesId => {
                                return ["vote_for_review", {
                                    voter: self.user.username,
                                    review_id: review.id,
                                    discipline_id: disciplinesId,
                                    weight: self.DEIP_100_PERCENT
                                }]
                            });
                            const unsignedTX = {
                                'expiration': expire,
                                'extensions': [],
                                'operations': operations,
                                'ref_block_num': BlockNum,
                                'ref_block_prefix': BlockPrefix
                            }
                            try {
                                const signedTX = deipRpc.auth.signTransaction(unsignedTX, {
                                    "owner":  self.user.privKey
                                })

                                deipRpc.api.broadcastTransactionSynchronous(signedTX, function(err, result) {
                                    self.isReviewVoting = false;
                                    if (err) {
                                        self.$store.dispatch('layout/setError', { message: "An error occurred while voting for review, please try again later"});
                                        console.log(err);
                                    } else {
                                        self.votingDisabled = true;
                                        self.$store.dispatch('layout/setSuccess', { message: "You've voted for review successfully!"});
                                    }
                                });
                            } catch (err) {
                                self.$store.dispatch('layout/setError', { message: "An error occurred while voting for review, please try again later"});
                                console.log(err);
                            }
                        });
                    }
                });
            }
        },
        created() {
            tenantHttp.getTenantsProfiles()
                .then((agencies) => {
                    this.agencies = agencies;
                })
        }
    };
</script>

<style lang="less" scoped>
    .eci-item {
        border: 1px solid #e4e4e4;
        border-radius: 3px;
    }
    .eci-label {
       color: #818181;
    }
    .support-review-button {
        width: 60%;
        margin: auto;
    }
</style>
