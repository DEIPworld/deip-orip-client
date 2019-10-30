<template>
    <div class="column full-height col-grow" style="max-width: 700px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Roadmap</div>
            <div class="col-grow">
                <div class="bold text-align-center c-pv-6">
                    Let’s create a roadmap for your research. Well-presented and detailed roadmap attracts 
                    more investors to help you to get the funding
                </div>

                <div class="">
                    <div class="row align-center c-pb-4" v-for="i in 3" :key="i">
                        <div class="pos-relative">
                            <v-btn dark outline color="grey darken-1" class="remove-milestone like-fab">
                                <div>
                                    <span class="number-icon">{{ i }}</span>
                                    <v-icon class="remove-icon" dark>clear</v-icon>
                                </div>
                            </v-btn>
                            <div class="milestone-devider"></div>
                        </div>
                        <div class="c-pl-8 col-grow">
                            <v-text-field solo label="Milestone name"></v-text-field>
                        </div>
                    </div>
                    
                    <div class="row align-center c-pb-4">
                        <div class="pos-relative">
                            <v-btn fab dark color="primary">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                            <div class="milestone-devider last"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';
    
    export default {
        name: "CreateResearchRoadmap",
        props: {
            research : { type: Object, required: true }
        },
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

<style lang="less" scoped>
    .milestone-devider {
        position: absolute;
        border-right: 1px solid;
        height: 29px;
        bottom: 0;
        top: calc(100% - 6px);
        left: calc(50%);
    }
    .milestone-devider.last {
        border-color: #ddd;
        height: 50px;
    }
    .remove-milestone {
        .remove-icon {
            display: none;
        }
        &:hover {
            .number-icon {
                display: none;
            }
            .remove-icon {
                display: block;
            }
        }
    }
</style>
