<template>
    <v-card class="review-container hidden-last-child">
        <div class="row-nowrap c-p-6">
            <div class="review-left-block text-align-center">
                <v-avatar size="90px">
                    <img v-if="review.author.profile" v-bind:src="review.author.profile.avatar | avatarSrc(90, 90, false)" />
                    <v-gravatar v-else :title="review.author.account.name" :email="review.author.account.name + '@deip.world'" />
                </v-avatar>

                <div class="bold c-pt-2">{{ review.author | fullname }}</div>
                    <v-btn block color="primary"
                        v-if="review.author.account.name !== user.username && userHasExpertise" 
                        class="ma-0 mt-2" 
                        :loading="isReviewVoting" 
                        :disabled="isReviewVoting || userHasVoted"
                        @click="voteReview(review)"
                    >Vote</v-btn>
                </div>

                <div class="column c-ml-6">
                    <div>
                        <span class="grey--text">{{ review.created_at | dateFormat('D MMM YYYY', true) }}</span>

                        <span class="half-bold c-pl-2">
                            <span class="green--text text--darken-2" v-if="review.is_positive">Positive</span>
                            <span class="red--text text--darken-2" v-if="!review.is_positive">Negative</span>
                        </span>
                    </div>

                    <div class="c-pt-4 col-grow">
                        {{ review.content }}
                    </div>

                    <div class="row-nowrap">
                        <div v-for="tvo in disciplines">
                            <span class="c-pr-1">
                                <span class="bold green--text text--darken-2">{{ tvo.disciplineName }}</span>
                            </span>

                            <span class="c-pr-4">
                                <span>{{tvo.totalWeight}}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        <v-divider></v-divider>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ReviewListItem",
        props: {
            review: { required: true},
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                research: 'rd/research'
            }),
            disciplines() {
                const out = [];
                const review = this.review;
                const tvoList = [];

                for (var i = 0; i < review.disciplines.length; i++) {
                    const discipline = review.disciplines[i];
                    const weight = review.weight_per_discipline.find(arr => arr[0] === discipline.id);
                    const tvo = {
                        disciplineName: discipline.name,
                        totalWeight: weight !== undefined ? weight[1] : 0
                    }
                    out.push(tvo)
                }
                return out;
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => 
                            this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
        },
        data() {
            return {
                isReviewVoting: false,
                userHasVoted: false // flag for keeping vote state without reloading the whole list
            };
        },

        methods: {
            voteReview(review) {
                const self = this;
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
                                    self.isReviewVoting  = false;
                                    if(err){
                                        self.$store.dispatch('layout/setError', { message: "An error occurred while voting for review, please try again later"});
                                        console.log(err);
                                    } else {
                                        self.userHasVoted = true;
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
            this.userHasVoted = this.review.votes.find(vote =>vote.voter === this.user.account[0].name) !== undefined;
        }
    };
</script>

<style lang="less" scoped>
    .expand-btn {
        right: 24px;
        bottom: 12px;
    }
    .review-container {
        margin-bottom: 5px;
    }
</style>
