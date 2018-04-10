<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>

            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Discipline</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Research group</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Title</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Roadmap</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="5">
                        <div class="uppercase">Review share</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-pick-discipline
                                @incStep="incStep"
                            ></create-research-pick-discipline>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-pick-group
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-pick-group>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-meta
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-meta>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-roadmap
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-roadmap>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="5">
                        <div class="row-nowrap justify-center full-height">
                            <create-research-share
                                @incStep="incStep" @decStep="decStep"
                            ></create-research-share>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchCreatingPage",
        data() { 
            return {
                currentStep: 0
            } 
        },
        methods: {
            incStep() {
                if (this.currentStep < 5) {
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
