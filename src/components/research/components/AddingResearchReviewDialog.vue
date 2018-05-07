<template>
    <v-dialog v-model="isShown.value" fullscreen persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="isShown.value = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add a review</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click.native="isShown.value = false">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <div class="display-flex">
                <div class="c-p-10 c-mh-auto col-grow review-form">
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

                            <div class="c-pt-6">
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

                            <div class="c-pt-6">
                                <v-text-field
                                    label="Type your review below" 
                                    multi-line auto-grow
                                    rows="2"
                                    v-model="review"
                                ></v-text-field>
                            </div>
                            <div class="row justify-end">
                                <div>
                                    <v-btn flat color="primary">Preview</v-btn>
                                    <v-btn color="primary" class="width-9">Publish</v-btn>
                                </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <v-card class="c-p-8">
                                <div class="bold subheading c-pb-2">Your Expertise</div>
                                <div class="c-pt-4">
                                    <span>Physics</span>
                                    <span class="right half-bold">2 250</span>
                                </div>
                                <div class="c-pt-4">
                                    <span>Math</span>
                                    <span class="right half-bold">1 020</span>
                                </div>
                            </v-card>
                            <div class="red--text c-pt-4 text-align-center">
                                <v-icon color="red">warning</v-icon>
                                123 Tokens will be blocked for 24 hours after the review
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

    export default {
        name: "AddingResearchReviewDialog",
        props: {
            isShown: { type: Object, required: true },
            research: Object,
            membersList: Object
        },
        data() { 
            return {
                REVIEW_POSITIVE: 'positive',
                REVIEW_NEGATIVE: 'negative',

                reviewQuality: undefined,
                review: ''
            }
        },
        methods: {},
        computed: {
            authorsStr() {
                return _(this.membersList).map('owner').join(' · ');
            }
        },
        watch: {
            'isShown.value': function(value) {
                if (value === true) {
                    this.review = '';
                    this.reviewQuality = undefined;
                }
            }
        },
        created() {}
    };
</script>

<style lang="less" scoped>
    .review-form {
        max-width: 1280px;
    }
</style>
