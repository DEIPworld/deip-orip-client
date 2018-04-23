<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>

            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Title</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Description</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Members</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Tokens</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <create-research-group-title
                                @incStep="incStep"
                            ></create-research-group-title>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <create-research-group-description
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-group-description>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <create-research-group-members
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-group-members>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-group-share
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-group-share>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchGroupCreating",
        data() { 
            return {
                currentStep: 0
            } 
        },
        methods: {
            incStep() {
                if (this.currentStep < 4) {
                    this.currentStep++;
                } else {
                    this.currentStep = 1;
                }
            },
            decStep() {
                this.currentStep--;
            }
        }
    };
</script>

<style lang="less">    
    .stepper__content {
        height: 100%;
        padding-right: 0px;
        padding-left: 0px;
        .stepper__wrapper {
            height: 100%;
        }
    }

    .step-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 16px;
    }
</style>
