<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add title and description</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto c-pt-4" style="max-width: 1000px;">
                    <div class="row">
                        <div class="col-3"></div>
                        <div class="col-6">
                            <v-textarea v-model="title" v-on:keyup="setTitle" 
                                name="title" label="Title" 
                                solo
                            ></v-textarea>
                        </div>
                        <div class="col-3"></div>
                    </div>

                    <div class="row c-pt-4">
                        <div class="col-3"></div>
                        <div class="col-6">
                            <v-textarea v-model="description" v-on:keyup="setDescription" 
                                name="Description" label="Description" 
                                solo
                            ></v-textarea>
                        </div>
                        <div class="col-3"></div>
                    </div>

                <!--    <div class="row c-pt-4">
                        <div class="col-offset-3 col-6">
                            <v-checkbox v-model="tmpIsPrivate" label="Choose if group should be private"></v-checkbox>
                        </div>
                    </div> -->

                <!--    <div class="row c-pt-4">
                        <div class="col-3 font-18px bold c-pr-4">Main goals of your research</div>
                        <div class="col-6">
                            <v-text-field name="goals" label="Goals" solo textarea hide-details></v-text-field>
                        </div>
                    </div> -->
                </div>
            </div>

        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary"
                :disabled="nextDisabled"
                :loading="isLoading"
                @click.native="nextStep()"
            >Create research</v-btn>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';
    
    export default {
        name: "CreateResearchMeta",
        props: {
            research: { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
        },
        data() { 
            return {
                title: "",
                description: "",
                tmpIsPrivate: false
            }
        },
        computed: {
            nextDisabled(){
                return !this.research.title || !this.research.description || this.isLoading;
            }
        },
        methods: {
            nextStep() {
                // temporary it is the last step
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setTitle() {
                this.$emit('setTitle', this.title);
            },
            setDescription() {
                this.$emit('setDescription', this.description);
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
