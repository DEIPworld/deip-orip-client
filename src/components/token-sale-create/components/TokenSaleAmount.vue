<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
         <!--   <div class="step-title">
                Please type percent (%) of research token<br>
                belonging to your group you’re going to sell
            </div> -->
            <div class="step-title">
                Determine the percent of research tokens for sale
            </div>

            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto amount-max-width">
                    <div class="col-12">
                        <div class="">
                            <v-text-field 
                                :hint="100 - getAmountNumber(tokenSaleInfo.amountToSell) + '% left'"
                                suffix="%" 
                                mask="###"
                                v-model="tokenSaleInfo.amountToSell"
                                :rules="amountToSellRules"
                            ></v-text-field>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <div class="row justify-center align-center">
            <v-btn color="primary" @click.native="nextStep()" :disabled="!verifyAmountRange(tokenSaleInfo.amountToSell)">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSaleAmount",
        props: {
            tokenSaleInfo: { type: Object, required: true }
        },
        data() { 
            return {
                amountToSellRules: [
                    v => !!v || 'This field is required',
                    v => this.verifyAmountRange(v) || 'Amount should be from 1 to 100'
                ]
            } 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            getAmountNumber(value) {
                return value === '' ? 0 : parseInt(value);
            },
            verifyAmountRange(value) {
                const amountNumber = this.getAmountNumber(value);
                return amountNumber > 0 && amountNumber <= 100;
            }
        }
    };
</script>

<style lang="less" scoped>
    .amount-max-width {
        max-width: 300px;
    }
</style>
