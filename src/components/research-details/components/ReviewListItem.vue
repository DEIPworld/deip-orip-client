<template>
    <v-card class="review-container hidden-last-child">
        <div class="row-nowrap c-p-6">
            <div class="review-left-block text-align-center">
                <v-avatar size="90px">
                    <v-gravatar :title="review.author" :email="review.author + '@deip.world'" />
                </v-avatar>
                <div class="bold c-pt-2">{{ review.author }}</div>
                    <v-btn v-if="review.author != user.username && userHasExpertise" class="ma-0 mt-2" block color="primary" 
                            :loading="isReviewVoting" 
                            :disabled="isReviewVoting"
                            @click="voteReview(review)">Vote</v-btn>
                </div>
                <div class="column c-ml-6">
                    <div>
                        <span class="grey--text">{{ new Date(review.created_at).toDateString() }}</span>
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
    import deipRpc from '@deip/deip-rpc';

    export default {
        name: "ResearchListItem",
        props: {
            review: { required: true},
        },
        computed: {
            ...mapGetters({
                user: 'user',
                userExperise: 'userExperise',
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
            }
        },
        data() {
            return {
                isReviewVoting: false
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

                const promises = [];       

                disciplinesIds.forEach(disciplineId => {
                    debugger;
                    promises.push(
                        deipRpc.broadcast.voteForReviewAsync(
					        self.user.privKey,
					        self.user.username, 
					        review.id,
                            disciplineId,
                            self.DEIP_100_PERCENT,
					        new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 ))
                    );
                });

                // I have no idea what happens here, 
                // the promise just never get resolved although op is send and applied in the blockchain
                Promise.all(promises)
                    .then(() => {
                         self.isReviewVoting = false;
                    }, (err) => {
                         self.isReviewVoting = false;
                    }).catch(() => {
                         self.isReviewVoting = false;
                    })
                    .finally(() => {
                         self.isReviewVoting = false;
                    })

                //todo: fix this closure
                setTimeout(() => {
                    self.isReviewVoting = false;
                }, 3000)
                
            }
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
