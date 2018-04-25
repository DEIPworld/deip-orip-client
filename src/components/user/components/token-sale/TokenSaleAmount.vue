<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Please type token Amount (%) you’re going to sell</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto amount-max-width">
                    <div class="col-12">
                        <div class="">
                            <v-text-field hint="80% left" suffix="%"></v-text-field>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSaleAmount",
        data() { 
            return {} 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            }
        }
    };
</script>

<style lang="less">
    .amount-max-width {
        max-width: 300px;
    }
</style>
