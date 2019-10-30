<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Share reward with reviewers</div>
            <div class="legacy-col-grow overflow-y-auto">

                <div class="legacy-row c-mh-auto research-reward-max-width">
                    <div class="col-12">
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

                        <div class="legacy-column align-center">
                            <div class="c-pt-8 caption grey--text" v-if="reviewShare">
                                {{reviewShare}}% of  potential research reward will be shared between all
                                the reviewers according to their Review Index  
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" :disabled="nextDisabled" :loading="isLoading" @click.native="finish()"> 
                {{!isPersonalGroup ? 'Create Proposal' : 'Create Research'}}
            </v-btn>
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
            ...mapGetters({
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            nextDisabled() {
                return !this.research.review_share_in_percent
                    || !(this.research.review_share_in_percent >= 0 && this.research.review_share_in_percent <= 50)
                    || this.isLoading;
            },
            isPersonalGroup() {
                return this.research.group 
                    ? this.research.group.id == this.userPersonalGroup.id 
                    : false;
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
