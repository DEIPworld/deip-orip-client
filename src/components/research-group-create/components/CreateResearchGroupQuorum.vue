<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Quorum setup</div>
            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <v-layout row mx-auto class="group-quorum-max-width">
                    <v-flex xs12>
                        <div>
                            Quorum shows how many votes it takes to approve a proposal (such as changing the research
                            content, adding the research group members, initiating research fundraise, etc.) You can setup Quorum for each 
                            proposal individually using
                            <span class="font-weight-medium clickable" @click="changeMode()">Advanced</span>
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

                        <v-layout row v-show="isAdvanced">
                            <v-flex offset-xs2>
                                <div class="py-3 font-weight-bold">Advanced quorum setup</div>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.startResearch"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Start new research project</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.createMaterial"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Publish research project results</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.changeReviewSharePercent"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Change research review award share</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.inviteMembers"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Invite new member to research group</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.dropoutMembers"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Exclude member from research group</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.startResearchTokenSale"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Schedule research fundraising campaign</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.offerResearchTokens"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Offer research shares</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.sendFunds"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Transfer research group funds</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6"
                                            v-model="group.quorum.changeQuorum"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Change research group quorum threshold</div>
                                </v-layout>

                                <v-layout row align-end>
                                    <div>
                                        <v-text-field class="width-6 pa-0"
                                            v-model="group.quorum.rebalanceGroupTokens"
                                            suffix="%"
                                            mask="###"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div class="flex-grow-1 ml-4">Rebalance research group tokens</div>
                                </v-layout>

                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>

            </div>
        </v-flex>
        <v-flex flex-grow-0>
          <v-layout row justify-center align-center>
              <v-btn flat small @click.native="prevStep()">
                  <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
              </v-btn>

              <v-btn color="primary" @click.native="nextStep()" :disabled="nextDisabled">Next</v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
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
