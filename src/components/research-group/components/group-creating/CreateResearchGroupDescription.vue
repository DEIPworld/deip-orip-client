<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Group Description</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-description-max-width">
                    <div class="col-12">
                        <v-text-field name="Description"
                            label="Description"
                            solo multi-line
                            auto-grow
                            v-model="groupInfo.description"
                            hint="Description/summary guidlines text. You can change this text any time"
                            :rules="descriptionRules"
                        ></v-text-field>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()" :disabled="groupInfo.description === ''">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchGroupDescription",
        props: {
            groupInfo: { required: true }
        },
        data() { 
            return {
                descriptionRules: [ v => !!v || 'Description is required' ],
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
    .group-description-max-width {
        max-width: 700px;
    }
</style>
