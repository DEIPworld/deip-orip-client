<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please select Soft Cap and Hard Cap amount</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto caps-max-width c-pt-4">
                    <div class="col-12">
                        <v-text-field label="Soft cap" append-icon="help" :append-icon-cb="cb"></v-text-field>
                    </div>
                    <div class="col-12">
                        <v-text-field label="Hard cap" append-icon="help" :append-icon-cb="cb"></v-text-field>
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
        name: "TokenSaleCaps",
        data() { 
            return {} 
        },
        methods: {
            cb() {
                alert('cb');
            },
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
    .caps-max-width {
        max-width: 500px;
    }
</style>
