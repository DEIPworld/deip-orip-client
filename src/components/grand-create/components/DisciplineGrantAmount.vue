<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">
                {{ this.grantInfo.discipline && this.grantInfo.discipline.label }} supply grant
            </div>
            
            <div class="sm-title bold c-mb-4 text-align-center">Please type amount</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-amount display-flex">
                    <div class="c-mv-auto full-width">
                        <v-text-field label="Amount, DEIP Tokens"
                            ref="amount"
                            v-model="grantInfo.amount"
                            :rules="[
                                rules.required,
                                rules.amount
                            ]"
                            :suffix="'of ' + deipTokenBalance"
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
                @click.native="nextStep()" 
                :disabled="!$refs.amount || !$refs.amount.valid"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisciplineGrantAmount",

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
                            return 'Amount is greater than your DEIP token balance';
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
        max-width: 500px;
    }
</style>
