<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
         <!--   <div class="step-title">
                Please type percent (%) of research token<br>
                belonging to your group you’re going to sell
            </div> -->
            <div class="step-title">
                Determine the amount of research tokens for sale
            </div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="legacy-row c-mh-auto amount-max-width">
                    <div class="legacy-col-12">
                        <div class="">
                            <v-text-field 
                                :hint="ownedAmount - getAmountNumber(tokenSaleInfo.amountToSell) + ' left'"
                                mask="#####"
                                v-model="tokenSaleInfo.amountToSell"
                                :rules="amountToSellRules"
                            ></v-text-field>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <div class="legacy-row legacy-justify-center align-center">
            <v-btn small flat :to="{ 
                name: 'ResearchDetails', 
                params: { 
                    group_permlink: encodeURIComponent(research.group_permlink),
                    research_permlink: encodeURIComponent(research.permlink)
                } 
                }">Cancel</v-btn>
            <v-btn color="primary" @click.native="nextStep()" :disabled="!verifyAmountRange(tokenSaleInfo.amountToSell)">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenSaleAmount",
        props: {
            research: { type: Object, required: true },
            tokenSaleInfo: { type: Object, required: true },
            ownedAmount: { type: Number, required: true }
        },
        data() { 
            return {
                amountToSellRules: [
                    v => !!v || 'This field is required',
                    v => this.verifyAmountRange(v) || `Amount should be from 1 to ${this.ownedAmount}`
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
                return amountNumber > 0 && amountNumber <= this.ownedAmount;
            }
        }
    };
</script>

<style lang="less" scoped>
    .amount-max-width {
        max-width: 300px;
    }
</style>
