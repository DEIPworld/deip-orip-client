<template>
    <div class="full-height">
        <div>
            <div class="step-title">Group description</div>
            <div class="overflow-y-auto">
                <div class="row c-mh-auto group-description-max-width">
                    <div class="col-12">
                        <v-textarea name="Description"
                            label="Description"
                            solo
                            auto-grow
                            v-model="description"
                            :rules="descriptionRules"
                        ></v-textarea>
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
        name: "CreateResearchGroupDescription",
        props: {
            group: {type: Object, required: true }
        },
        data() { 
            return {
                description: "",
                descriptionRules: [ v => !!v || 'Group description is required' ],
            } 
        },
        computed: {
            nextDisabled(){
                return !this.group.description;
            }
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            }
        },
        watch: {
            description() {
                this.$emit('setDescription', this.description);
            }
        }
    };
</script>

<style lang="less" scoped>
    .group-description-max-width {
        max-width: 700px ;
    }
</style>
