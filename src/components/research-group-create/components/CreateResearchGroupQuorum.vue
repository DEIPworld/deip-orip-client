<template>
    <div class="column full-height">
        <div class="c-mb-4 legacy-col-grow column">
            <div class="step-title">Quorum setup</div>
            <div class="legacy-col-grow overflow-y-auto">

                <div class="row c-mh-auto group-quorum-max-width">
                    <div class="col-12">
                        <div>
                            Quorum shows how many votes it takes to approve a proposal (such as changing the research
                            content, adding the research group members, initiating research fundraise, etc.) You can setup Quorum for each 
                            proposal individually using
                            <span class="deip-blue-color half-bold clickable" @click="changeMode()">Advanced</span>
                            options.
                        </div>

                        <v-text-field 
                            v-model="totalQuorum"
                            :disabled="isAdvanced"
                            suffix="%"
                            mask="###"
                            hide-details
                            @keyup="onChangeTotalQuorum()"
                        ></v-text-field>

                        <div class="row" v-show="isAdvanced">
                            <div class="legacy-col-offset-2">
                                <div class="c-pv-4 deip-blue-color bold">Advanced quorum setup</div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.startResearch"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Start research</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.createMaterial"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Publish research results</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.changeReviewSharePercent"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Change research review share</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.inviteMembers"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Invite members</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.dropoutMembers"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Dropout member</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.startResearchTokenSale"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Start research fundraise</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.offerResearchTokens"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Offer research tokens</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.sendFunds"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Send funds</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.changeQuorum"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Change quorum</div>
                                </div>

                                <div class="row legacy-align-items-end">
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.rebalanceGroupTokens"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="legacy-col-grow c-ml-8">Rebalance research group tokens</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary" @click.native="nextStep()" :disabled="nextDisabled">Next</v-btn>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import * as proposalService from './../../../services/ProposalService';

    export default {
        name: "CreateResearchGroupQuorum",

        props: {
            group: { type: Object, required: true }
        },

        data() { 
            return {
                isAdvanced: false,
                totalQuorum: 50
            } 
        },

        computed: {
            nextDisabled() {
                return _.some(this.group.quorum, value => 
                    proposalService.validateQuorumValue(value)
                );
            }
        },

        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },

            changeMode() {
                this.isAdvanced = !this.isAdvanced;
                this.onChangeTotalQuorum();
            },
            onChangeTotalQuorum() {
                if (!this.isAdvanced) {
                    _.keys(this.group.quorum).forEach(key => {
                        this.group.quorum[key] = this.totalQuorum;
                    });
                }
            }
        },

        created() {
            this.onChangeTotalQuorum();
        }
    };
</script>

<style lang="less" scoped>
    .group-quorum-max-width {
        max-width: 510px;
    }
</style>
