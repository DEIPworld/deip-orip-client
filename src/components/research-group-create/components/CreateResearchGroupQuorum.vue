<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Quorum setup</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-quorum-max-width">
                    <div class="col-12">
                        <div>
                            Quorum shows how many votes it takes to approve a proposal (such as change in the reseach
                            content, add researc group members, research token sale, etc.) You can setup Quorum for each 
                            proposal using <span class="deip-blue-color">Advanced</span> options
                        </div>

                        <v-text-field suffix="%" mask="###" hide-details></v-text-field>

                        <div class="row">
                            <div class="col-offset-2">
                                <div class="c-pv-4 deip-blue-color bold">Advanced quorum setup</div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Start research</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Create research material</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Change quorum</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Invite members</div>
                                </div>

                                <div class="row align-items-end minus-top-margin">
                                    <div>
                                        <v-text-field class="width-6" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Dropout member</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Start research token sale</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Accept research token offer</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Offer research tokens</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Send funds</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Change research review share percent</div>
                                </div>

                                <div class="row align-items-end">
                                    <div>
                                        <v-text-field class="width-6 minus-top-margin" suffix="%" mask="###" hide-details></v-text-field>
                                    </div>
                                    <div class="col-grow c-ml-8">Rebalance research group tokens</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary" @click.native="nextStep()" :disabled="nextDisabled">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchGroupQuorum",
        props: {
            group: { type: Object, required: true }
        },
        data() { 
            return {
            } 
        },
        computed: {
            nextDisabled(){
                return false;
            }
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

<style lang="less" scoped>
    .group-quorum-max-width {
        max-width: 500px;
    }
    .minus-top-margin {
        margin-top: -17px;
    }
</style>
