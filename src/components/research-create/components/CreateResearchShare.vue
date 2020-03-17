<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Share reward with reviewers</div>
            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <v-layout row mx-auto class="research-reward-max-width">
                    <v-flex xs12>
                        <div>
                            How much reward would you like to share with reviewers?
                            The bigger the percent is, the better chance of getting reviews and increasing research popularity you have.
                            You can choose between 0-50%
                        </div>
                        <v-text-field 
                            v-model="reviewShare" 
                            v-on:keyup="setReviewShare"
                            suffix="%"
                            mask="##"
                            hide-details>
                        </v-text-field>

                        <div class="flex-column align-center">
                            <div class="pt-8 caption grey--text" v-if="reviewShare">
                                {{reviewShare}}% of  potential research reward will be shared between all
                                the reviewers according to their Review Index  
                            </div>
                        </div>
                    </v-flex>
                </v-layout>

            </div>
        </v-flex>

        <v-flex flex-grow-0>
            <v-layout row justify-center align-center>
                <v-btn flat small @click.native="prevStep()">
                    <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
                </v-btn>
                <v-btn color="primary" :disabled="nextDisabled" :loading="isLoading" @click.native="finish()"> 
                    {{!isCentralizedGroup ? 'Create Proposal' : 'Create Project'}}
                </v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
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
            ...mapGetters({
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            nextDisabled() {
                return !this.research.review_share_in_percent
                    || !(this.research.review_share_in_percent >= 0 && this.research.review_share_in_percent <= 50)
                    || this.isLoading;
            },
            isCentralizedGroup() {
                return this.research.group.is_centralized || this.research.group.is_personal;
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

<style lang="less" scoped>
    .research-reward-max-width {
        max-width: 510px;
    }
</style>
