<template>
    <v-dialog v-model="isOpen" fullscreen persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Post review</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <div v-if="research" class="column-page">
                <div class="content-column">
                    <div class="filling">
                        <div class="sm-title bold">You're giving a review to</div>

                        <div class="row c-pt-8">
                            <div class="col-8 c-pr-6">
                                <v-card class="c-p-6">
                                    <div class="deip-blue-color half-bold subheading">
                                        {{ research.title }}
                                    </div>
                                    <div class="caption grey--text c-pt-2">
                                        {{ authorsStr }}
                                    </div>
                                </v-card>

                                <div class="row justify-between align-end c-pt-6">
                                    <div>
                                        <span class="c-pr-2">
                                            <v-btn class="ma-0" 
                                                :dark="reviewQuality === REVIEW_POSITIVE" 
                                                :color="reviewQuality === REVIEW_POSITIVE ? 'green darken-2' : undefined" 
                                                small depressed
                                                @click="reviewQuality = REVIEW_POSITIVE"
                                            >Positive</v-btn>
                                        </span>
                                        <span>
                                            <v-btn class="ma-0" 
                                                :dark="reviewQuality === REVIEW_NEGATIVE" 
                                                :color="reviewQuality === REVIEW_NEGATIVE ? 'red darken-2' : undefined" 
                                                small depressed
                                                @click="reviewQuality = REVIEW_NEGATIVE"
                                            >Negative</v-btn>
                                        </span>
                                    </div>

                                    <div class="col-grow c-pl-10">
                                        <v-select
                                            :items="contentList"
                                            v-model="contentId"
                                            label="Content"
                                            item-text="title"
                                            item-value="id"
                                            hide-details
                                        ></v-select>
                                    </div>
                                </div>

                                <div class="c-pt-6">
                                    <v-text-field
                                        label="Leave your review below" 
                                        multi-line auto-grow
                                        rows="2"
                                        v-model="review"
                                    ></v-text-field>
                                </div>
                                <div class="row justify-end">
                                    <div>
                                        <!-- <v-btn flat color="primary" @click="log()">Preview</v-btn> -->
                                        <v-btn color="primary" class="width-9"
                                            :disabled="reviewQuality === undefined || review === '' || isLoading"
                                            @click="publishReview()"
                                            :loading="isLoading"
                                        >Publish</v-btn>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4">
                                <v-card class="c-p-8">
                                    <div class="bold subheading c-pb-2">Your Expertise</div>
                                    <div class="c-pt-4" v-for="(exp, index) in relatedExpertise" :key="index">
                                        <span>{{exp.discipline_name}}</span>
                                        <span class="right half-bold">{{exp.amount}}</span>
                                    </div>
                                </v-card>
                                <div class="red--text c-pt-4 text-align-center">
                                    <v-icon color="red">warning</v-icon>
                                    100% of your expert tokens will be blocked for 24 hours after the review
                                </div>
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
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex'

    export default {
        name: "AddResearchReviewDialog",
        computed: {
            ...mapGetters({
                user: 'user',
                userExperise: 'userExperise',
                research: 'rd/research',
                membersList: 'rd/membersList',
                contentList: 'rd/contentList',
                isOpen: 'rd/isReviewDialogOpen'
            }),
            authorsStr() {
                return _(this.membersList).map('owner').join(' · ');
            },
            relatedExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.filter(exp => 
                            this.research.disciplines.find(d => d.id == exp.discipline_id))
                    : false
            }
        },
        data() { 
            return {
                REVIEW_POSITIVE: 'positive',
                REVIEW_NEGATIVE: 'negative',

                reviewQuality: undefined,
                review: '',
                isLoading: false,
                contentId: undefined,
            }
        },
        methods: {

            close(){
                this.$store.dispatch('rd/closeReviewDialog');
            },

            publishReview() {
                this.isLoading = true;
                deipRpc.broadcast.makeReviewAsync(
                    this.user.privKey,
                    this.user.username,
                    this.contentId,
                    this.review,
                    this.reviewQuality === this.REVIEW_POSITIVE
                ).then((data) => {
                    this.$store.dispatch('rd/loadResearchReviews', this.research.id);
                    this.$store.dispatch('rd/closeReviewDialog');
                    this.$store.dispatch('layout/setSuccess', {
                        isVisible: true, 
                        message: "Your review has been posted successfully !"
                    });
                })
                .catch((err) => {
                    this.$store.dispatch('layout/setError', {
                        isVisible: true, 
                        message: "An error occurred while adding review, please try again later"
                    });
                    console.log(err)
                })
                .finally(() => {
                    this.isLoading = false
                });
            },

        }
    };
</script>

<style lang="less" scoped>
</style>
