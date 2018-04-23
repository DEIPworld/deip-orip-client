<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add description</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-description-max-width">
                    <div class="col-12">
                        <v-text-field name="Description"
                            label="Description" 
                            textarea auto-grow
                            hint="Description/summary guidlines text. You can change this text any time"
                        ></v-text-field>
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
        name: "CreateResearchGroupDescription",
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
    .group-description-max-width {
        max-width: 700px;
    }
</style>
