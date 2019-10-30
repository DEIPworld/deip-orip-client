<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">
                Supply grant for "{{ this.grantInfo.discipline && this.grantInfo.discipline.label }}" discipline
            </div>
            
            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-amount display-flex">
                    <div class="c-mv-12 full-width">
                        <v-text-field label="Amount, DEIP Tokens"
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

        <div class="row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="nextStep()" 
                :disabled="nextIsDisabled"
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
            }
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
        },

        computed: {
            nextIsDisabled() {
                return !this.grantInfo.amount || !this.$refs.amount.valid || this.grantInfo.amount.length < 3;
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-amount {
        max-width: 500px;
    }
</style>
