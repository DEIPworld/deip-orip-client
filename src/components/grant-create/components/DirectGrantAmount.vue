<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">
                Direct grants distribution
            </div>
            
            <div class="title bold c-mb-4 text-align-center">Please type amount</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-amount display-flex">
                    <div class="c-mt-12 full-width">
                        <div class="caption grey--text">You are going to support the following research:</div>

                        <v-card class="c-mt-2 c-mb-12" v-if="grantInfo.research">
                            <div class="c-p-6">
                                <div class="a">{{ grantInfo.research.title }}</div>
                        
                                <div class="caption grey--text c-pt-2">
                                    <template v-for="author in grantInfo.research.authors">
                                        <span>{{ author }}</span>
                                        <span> · </span>
                                    </template>
                                </div>
                            </div>
                        </v-card>

                        <v-text-field label="Amount"
                            ref="amount"
                            v-model="grantInfo.amount"
                            :rules="[
                                rules.required,
                                rules.amount
                            ]"
                            :suffix="'of ' + deipTokenBalance + ' DEIP'"
                        ></v-text-field>
                    </div>
                </div>

            </div>
        </div>

        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="nextStep()" 
                :disabled="!$refs.amount || !$refs.amount.valid"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DirectGrantAmount",

        props: {
            grantInfo: { type: Object, required: true },
            deipTokenBalance: { required: true, type: Number }
        },

        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
        },

        data() {
            return {
                rules: {
                    required: value => !!value || 'This field is required',
                    amount: value => {
                        let formatValidationResult = this.deipTokenValidator(value);

                        if (formatValidationResult !== true) {
                            return formatValidationResult;
                        } else if (parseFloat(value) > this.deipTokenBalance) {
                            return 'Amount is greater than your DEIP Token balance';
                        }
                        
                        return true;
                    },
                },
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-amount {
        max-width: 600px;
    }
</style>
