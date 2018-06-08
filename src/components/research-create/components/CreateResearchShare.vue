<template>
    <div class="column full-height col-grow" style="max-width: 1000px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Review share</div>
            <div class="col-grow">
                <div class="font-18px bold text-align-center c-pv-12">
                    How much reward would you like to share with reviewers? 
                    The bigger the percent the better chance of getting reviews and increasing research popularity. 
                    You can choose between 5-50%
                </div>

                <div class="column align-center">
                    <div>
                        <div class="display-inline-block width-12">
                            <v-text-field v-model="reviewShare" v-on:keyup="setReviewShare" solo mask="##" label="min 5%"></v-text-field>
                        </div>
                        <div class="display-inline-block font-18px bold deip-blue-color c-pl-2">
                            %
                        </div>
                    </div>
                    <div class="c-pt-8 caption grey--text" v-if="reviewShare">
                        {{reviewShare}}% of  potential research reward will be shared between all the reviewers according to their votes  
                    </div>
                </div>
            </div>

        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" :disabled="nextDisabled" :loading="isLoading" @click.native="finish()">Create Proposal</v-btn>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';

    export default {
        name: "CreateResearchShare",
        props: {
            research : { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
        },
        data(){
            return {
                reviewShare: this.research.review_share_in_percent // default
            }
        },
        computed: {
            nextDisabled() {
                debugger;
                return !this.research.review_share_in_percent || 
                       !(this.research.review_share_in_percent > 0 * this.DEIP_1_PERCENT && 
                       this.research.review_share_in_percent <= 50 * this.DEIP_1_PERCENT);
            }
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setReviewShare(){
                this.$emit('setReviewShare', this.reviewShare);
            },
            finish(){
                this.$emit('finish');
            }
        }
    };
</script>

<style lang="less">
</style>
