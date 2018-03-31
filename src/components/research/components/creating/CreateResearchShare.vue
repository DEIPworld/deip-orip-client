<template>
    <div class="column full-height col-grow" style="max-width: 1000px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Review share</div>
            <div class="col-grow">
                <div class="font-18px bold text-align-center c-pv-12">
                    How much reward you would like to share with the reviewer? 
                    The bigger the present the better chance of getting reviews and increase research popularity 
                    You can choose 5-50%
                </div>

                <div class="column align-center">
                    <div>
                        <div class="display-inline-block width-12">
                            <v-text-field solo label="min 5%"></v-text-field>
                        </div>
                        <div class="display-inline-block font-18px bold deip-blue-color c-pl-2">
                            %
                        </div>
                    </div>
                    <div class="c-pt-8 hint">
                        5% of  potential research reward will be shared between all the  reviewers according to their  votes  
                    </div>
                </div>
            </div>

        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchShare",
        data() { 
            return {} 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            }
        }
    };
</script>

<style lang="less">
    .hint {
        font-size: 12px;
        color: #ccc;
    }
</style>
