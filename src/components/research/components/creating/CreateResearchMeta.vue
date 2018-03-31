<template>
    <div class="column full-height col-grow" style="max-width: 1000px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Add title, description and goals</div>
            <div class="col-grow">
                <div class="row">
                    <div class="col-3 font-18px bold c-pr-4">Set title for your research</div>
                    <div class="col-6">
                        <v-text-field name="title" label="Title" solo textarea hide-details></v-text-field>
                    </div>
                    <div class="col-3 field-description c-pl-4">Title guidelines text</div>
                </div>

                <div class="row c-pt-4">
                    <div class="col-3 font-18px bold c-pr-4">Write short description here</div>
                    <div class="col-6">
                        <v-text-field name="Description" label="Description" solo textarea hide-details></v-text-field>
                    </div>
                    <div class="col-3 field-description c-pl-4">Description/summary guidlines text Goals etc...?</div>
                </div>
                
                <div class="row c-pt-4">
                    <div class="col-3 font-18px bold c-pr-4">Main goals of your research</div>
                    <div class="col-6">
                        <v-text-field name="goals" label="Goals" solo textarea hide-details></v-text-field>
                    </div>
                    <div class="col-3 field-description c-pl-4"></div>
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
        name: "CreateResearchPickGroup",
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
    .field-description {
        color: #ccc;
    }
</style>
