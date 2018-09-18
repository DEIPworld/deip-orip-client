<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Direct grants distribution</div>
            <div class="sm-title bold c-mb-2 text-align-center">Please type special conditions (optional)</div>

            <div class="caption c-mb-4 text-align-center grey--text">
                You can grant your expertise tokens that match researcher's disciplines
            </div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-conditions">
                    <div class="c-pt-12">
                        <v-text-field v-model="grantInfo.description"
                            multi-line
                            rows="3" auto-grow
                            label="You can mention some important features"
                        ></v-text-field>
                    </div>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="finish()" 
                :disabled="isLoading"
                :loading="isLoading"
            >Give grant</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DirectGrantConditions",

        props: {
            grantInfo: { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
        },

        methods: {
            finish() {
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            }
        },

        data() {
            return {}
        }
    };
</script>

<style lang="less" scoped>
    .discipline-conditions {
        max-width: 800px;
    }
</style>
