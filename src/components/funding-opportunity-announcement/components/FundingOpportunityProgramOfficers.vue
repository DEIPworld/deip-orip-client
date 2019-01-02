<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Select Program Officers</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto program-officers-max-width">
                    <v-card class="c-ph-12 c-pv-6">
                        <v-text-field
                            label="Start typing for suggestion"
                            append-icon="search"
                        ></v-text-field>

                        <v-radio-group>
                            <div class="row">
                                <div class="width-8">
                                    <v-radio
                                        label="By name"
                                        value="by-name"
                                    ></v-radio>
                                </div>

                                <div class="width-8">
                                    <v-radio
                                        label="By keywords"
                                        value="by-keywords"
                                    ></v-radio>
                                </div>
                            </div>
                        </v-radio-group>

                        <div class="c-pt-8">
                            <div class="row-nowrap align-items-center">
                                <v-avatar size="40px" class="">
                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                    <v-gravatar :email="'shawna' + '@deip.world'" />
                                </v-avatar>

                                <div class="c-pl-4 col-grow">
                                    <span class="a">Shawna Mathis</span>
                                </div>

                                <div class="">
                                    <v-checkbox hide-details></v-checkbox>
                                </div>
                            </div>

                            <div class="row-nowrap align-items-center c-pt-4">
                                <v-avatar size="40px" class="">
                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                    <v-gravatar :email="'egow' + '@deip.world'" />
                                </v-avatar>

                                <div class="c-pl-4 col-grow">
                                    <span class="a">Egow Tompson</span>
                                </div>

                                <div class="">
                                    <v-checkbox hide-details></v-checkbox>
                                </div>
                            </div>

                            <div class="row-nowrap align-items-center c-pt-4">
                                <v-avatar size="40px" class="">
                                    <!-- <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" /> -->
                                    <v-gravatar :email="'Egota' + '@deip.world'" />
                                </v-avatar>

                                <div class="c-pl-4 col-grow">
                                    <span class="a">Egota Rydberg</span>
                                </div>

                                <div class="">
                                    <v-checkbox hide-details></v-checkbox>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>

            </div>
        </div>
        
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FundingOpportunityProgramOfficers",

        props: {
            opportunity: { type: Object, required: true }
        },

        data() { 
            return {
            } 
        },
        
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },

            isNextDisabled() {
                return false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .program-officers-max-width {
        max-width: 800px;
    }
</style>
