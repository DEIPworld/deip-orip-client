<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Add title and description</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto c-pt-4" style="max-width: 1000px;">
                    <div class="legacy-row">
                        <div class="legacy-col-3"></div>
                        <div class="legacy-col-6">
                            <v-textarea v-model="title" v-on:keyup="setTitle" 
                                name="title" label="Title" 
                                solo
                            ></v-textarea>
                        </div>
                        <div class="legacy-col-3"></div>
                    </div>

                    <div class="legacy-row c-pt-4">
                        <div class="legacy-col-3"></div>
                        <div class="legacy-col-6">
                            <v-textarea v-model="description" v-on:keyup="setDescription" 
                                name="Description" label="Description" 
                                solo
                            ></v-textarea>
                        </div>
                        <div class="legacy-col-3"></div>
                    </div>

                <!--    <div class="legacy-row c-pt-4">
                        <div class="legacy-col-offset-3 legacy-col-6">
                            <v-checkbox v-model="tmpIsPrivate" label="Choose if group should be private"></v-checkbox>
                        </div>
                    </div> -->

                <!--    <div class="legacy-row c-pt-4">
                        <div class="legacy-col-3 font-18px bold c-pr-4">Main goals of your research</div>
                        <div class="legacy-col-6">
                            <v-text-field name="goals" label="Goals" solo textarea hide-details></v-text-field>
                        </div>
                    </div> -->
                </div>
            </div>

        </div>

        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary"
                :disabled="nextDisabled"
                :loading="isLoading"
                @click.native="nextStep()"
            >Next</v-btn>
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
                // this.$emit('finish');
                this.$emit('incStep');
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
